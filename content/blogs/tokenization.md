---
title: What is a Token?
date: 2026-04-02
---

Tokens are units of data processed by AI models during training and inference, enabling prediction, generation and reasoning.

Under the hood of every AI Application are algorithms that churn through data in their own language. one based on a vacabulary of tokens.

Tokens are tiny units of data that come from breaking down bigger chunks of infromation. AI models process tokens to learn the relationships between them and unlock capabilities including prediction, generation and reasoning. The faster tokens can be processed, the faster models can learn and reponse.

## What is Tokenization（令牌化）?

Whether a transformer AI model is processing text, iamges, audio clips, videos and another modality, it will translate data into tokens. This process is known as `Tokenization`.

Efficient(高效的) tokenization helps reduce the amount of computing power required for training and inference. There are numerous tokenization methods - and tokenizers tailored specific data types and use cases can require a smaller vocabulary, meaning there are fewer tokens to process.

For LLMs(large language models), short words may be represented(代表) with a single token, while longer words may be split into two or more tokens.

The word darkness, for example, would be split into two tokens, "dark" and "ness", with each tokens bearing a numerical representation, such as 217 and 655. The opposite word, brightness,would similarly be split into "bright" and "ness", with corresponding numerical representations of 491 and 655.

In this example, the shared numerical value associated with "ness" can help the AI model understand that the words may have something in common. In other situations, a tokenizer may assign different numerical representations for the same word depending on its meaning in context.

For example, the word "lie" could refer to a resting position or to saying something untruthful. During training, the model would learn the distinction between these two meanings and assign them different token numbers.

For visual AI models that process images, video or sensor data, a tokenizer can help map visual inputs like pixels or voxels into a series of discrete tokens.

## How are Tokens used during AI training?

`Training` an AI model starts with the tokenization of the training dataset.

Based on the size of the training data, the number of tokens can number in the billions or trillions - and, pre the `pretraining scaling law`(预训练扩展定律), the more tokens used for training, the better the quality of the AI model.

As an AI model is pretrained, it's tested by being shown a sample set of tokens and asked to predict the next token. Based on whether or not its prediction is correct, the model updates itself to improve its next guess. This process is repeated until the model learns from its mistakes and reaches a target level of accuracy,known as `model convergence`(模型收敛).

After pretraining, models are further improved by `post-training`(后训练), where they continue to learn on a subset of tokens relevant to the use case where they'll be deployed. These could be tokens with domain-specific information for an application in law, medicine or business - or tokens that help tailor the model to a specific task, like reasoning, chat or translation. The goal is model that generates the right tokens to deliver a correct response based on a user's query - a skill better known as inference

## How are Tokens used during AI inference and reasoning?

During inference, an AI receives a prompt - which, depending on the model, may be text, image, audio clip, video, sensor(传感器) data or even gene sequence(基因) - that it translates into a series of tokens. The model processes these input tokens, generates its response as tokens and then translates it to the user's expected format.

Input and output languages can be different, such as in a model that translates English to Japanese, or noe that converts text prompts into images.

To understand a complete prompt, AI models must be able to process multiple tokens at once. Many models have a specified limit, referred to as a context window - and different use cases require different context window sizes.

A model that can process a few thousand tokens at once might be able to process a single high-resolution image or a few pages of text. With a context length of tens of thousands of tokens, another model might be able to summarize a whole novel or an hourlong podcast episode. Some models even provide context lengths of a million or more tgokens, allowing users to input massive data sources for the AI to analyze.

Reasoning AI models, the latest advancement in LLMs, can tackle more complex queries by treating tokens differently than before. Here, in addition to input and output tokens, the model generates a host of reasoning tokens over minutes or hours as it thinks about how to solve a given problem.

These reasoning tokens allow for better responses to complex questions, just like how a person can formulate a better answer given time to work through a problem. The corresponding increase in tokens per prompt can require over 100x more compute compared with a single inference pass on a traditional LLM - an example of test-time scaling, aka long thinking.
