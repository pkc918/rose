---
title: SSE的Catch-up和Live的实现
date: 2026-06-03
---

## 前言

在实现 AI Chat 系统时，遇到了对应的问题，就是 SSE 在前端中断后，数据存储与页面恢复的问题。看到ChatGPT的实现，SSE 的过程中关闭网页后，再次打开，进入对应的 conversation，依然能拿到关闭前的SSE数据（这个过程就是 Catch-up。ps：后面会讲），且如果再次打开会话经过 Catch-up 阶段后，SSE还在持续输出内容，ChatGPT 依然会连续输出。我大为震撼，因为我的Chat，关闭后SSE数据就丢失了（ps：现在已经可以了）。所以有了这篇文章。

## SSE，Catch-up，Live这些是什么？

### SSE

SSE 就是Server-Sent Events，是一种基于HTTP的服务器推送技术，允许服务器实时更新主动发送到客户端无需客户端重复请求的技术，AI大模型流式输出很常用！

### Catch-up

Catch-up是一个SSE阶段，表示`追溯/回放`，当建立SSE连接后，客户端的数据与服务端数据是未对其的状态，所以当服务器识别到客户端要同步历史状态后，将缓冲区（Buffer）或者数据库中的历史信息，按照SSE的格式连续发送给客户端，达到数据历史同步的状态。

### Live

Live同样是一个SSE阶段，表示`直播/实时`，当 Catch-up 阶段完成后，SSE长连接还有新数据在生成，立刻实时推送到前端，达到数据实时同步的状态。

## SSE的实现

提供Manager，采用注册表 + 发布订阅模式实现了 Catch-up 和 Live

### Manager

manager 将 conversation_id 和 对应的生成相关信息。manager中注册的conversation有一个生命周期

- 调用接口时，注册进表
- 当 ai api 流内容时，数据更新
- 当前 ai stream finished 后，清除注册

```go
type Generation struct {
	ConversationID uuid.UUID
	Buffer         []string
	content        string
	done           bool
	mu             sync.RWMutex
	subs           map[chan string]struct{}
}

func (g *Generation) Append(token string) {
	g.mu.Lock()
	g.Buffer = append(g.Buffer, token)
	g.content += token
	for ch := range g.subs {
		select {
		case ch <- token:
		default:
		}
	}
	g.mu.Unlock()
}

func (g *Generation) Subscribe() chan string {
	g.mu.Lock()
	defer g.mu.Unlock()
	ch := make(chan string, 256)
	g.subs[ch] = struct{}{}
	return ch
}

func (g *Generation) unsubscribe(ch chan string) {
	g.mu.Lock()
	defer g.mu.Unlock()
	delete(g.subs, ch)
}

func (g *Generation) finish() string {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.done = true
	for ch := range g.subs {
		close(ch)
	}
	g.subs = nil
	return g.content
}

func (g *Generation) isDone() bool {
	g.mu.RLock()
	defer g.mu.RUnlock()
	return g.done
}

func (g *Generation) Content() string {
	g.mu.RLock()
	defer g.mu.RUnlock()
	return g.content
}

type Manager struct {
	mu    sync.RWMutex
	items map[uuid.UUID]*Generation
}

func (m *Manager) Start(conversationID uuid.UUID) *Generation {
	m.mu.Lock()
	defer m.mu.Unlock()
	g := &Generation{
		ConversationID: conversationID,
		subs:           make(map[chan string]struct{}),
	}
	m.items[conversationID] = g
	return g
}

func (m *Manager) Subscribe(conversationID uuid.UUID) (chan string, []string, bool) {
	m.mu.RLock()
	g, ok := m.items[conversationID]
	m.mu.RUnlock()
	if !ok || g.isDone() {
		return nil, nil, false
	}

	g.mu.RLock()
	buffer := make([]string, len(g.Buffer))
	copy(buffer, g.Buffer)
	g.mu.RUnlock()

	ch := g.Subscribe()
	return ch, buffer, true
}

func (m *Manager) Finish(conversationID uuid.UUID) (string, bool) {
	m.mu.RLock()
	g, ok := m.items[conversationID]
	m.mu.RUnlock()
	if !ok {
		return "", false
	}
	content := g.finish()
	m.mu.Lock()
	delete(m.items, conversationID)
	m.mu.Unlock()
	return content, true
}
```

没有消费者时，将内容进行存储，当消费者上线后，需要先将存储的内容消费，实时的内容继续放入 channel，消费完catch 内容后，通过channel延迟流式。