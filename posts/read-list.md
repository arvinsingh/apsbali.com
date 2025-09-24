---
title: My Curated Resources for CUDA, Accelerators, & AI Inference
description: A living collection of foundational papers, practical guides, & communities for anyone diving into GPU computing & AI acceleration.
slug: accelerator-resources
date: Sep 24, 2025
published: True
---

This is a collection of my favorite reading materials & resources to help with learning about CUDA programming, GPUs, AI inference, & related topics. From foundational papers to modern optimization techniques & practical guides, these resources are designed for anyone interested in diving deeper into the world of GPU computing & AI.

## Industry & Expert Voices  

**Semianalysis**  
  Deep industry analysis on AI hardware economics & roadmaps. $500/year subscription, but worth it (even on free tier).  
  [Visit the site](https://semianalysis.com/)

**Andrej Karpathy**  
  Needs no introduction. :)  
  [Visit the channel](https://www.youtube.com/@AndrejKarpathy)

**Simon Boehm’s Blog (Anthropic Performance Team)**  
  Expert-level posts on CUDA optimization, GEMM, & parallelism.  
  [Check out the blog](https://siboehm.com/)

**Edward Z. Yang’s Blog**  
  Deep dives into PyTorch internals, compilers, & scalable ML systems.  
  [Read Edward’s blog](https://blog.ezyang.com/)

**High Yield**  
  Deep-dive analysis & commentary on chips, GPUs, & semiconductor trends. Great for staying sharp on the hardware underpinnings of AI acceleration.  
  [YouTube](https://www.youtube.com/@HighYield)

**AI News Aggregators**  
  - [smol.ai](https://news.smol.ai/) for daily AI news  

---

## GPUmode - The Biggest GPU Nerd Community

If you want to hang out where CUDA, PTX, & GPU architecture obsessives gather, **GPUmode** is the place. It’s part community, part knowledge base, & part rabbit hole of GPU lore.  

- [Join the Discord](https://discord.gg/gpumode)  
- [Watch the YouTube Channel for various expert talks](https://www.youtube.com/@GPUMODE)

---

## Foundational Readings  
**NVIDIA Tesla: A Unified Graphics & Computing Architecture**  
  The 2008 paper by Lindholm et al. that introduced Tesla & CUDA as a unified model for graphics + compute. A must-read for historical grounding.  
  [Read the paper](https://www.cs.cmu.edu/afs/cs/academic/class/15869-f11/www/readings/lindholm08_tesla.pdf)

**A History of NVIDIA’s Stream Multiprocessor** (Fabien Sanglard)  
  A beautifully written walkthrough of how NVIDIA’s SM evolved from Tesla through Turing. Great for architectural intuition.  
  [Check out the resource](https://fabiensanglard.net/cuda/)

**CUDA C++ Programming Guide (Official)**  
  The canonical reference from NVIDIA. Dry but essential.  
  [Read the guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)

---

## Practical Guides & Tools  
**(Mis)adventures in Running CUDA on Google Colab Free Tier** (Shashank Shekhar)  
  A hands-on debugging journey through Colab’s CUDA quirks; toolchain mismatches, PTX issues, & workarounds.  
  [Read the blog](https://www.shashankshekhar.com/blog/cuda-colab)

**Compiler Explorer (godbolt.org)**  
  An interactive playground to inspect CUDA/PTX assembly & understand what your kernels compile down to.  
  [Visit the site](https://godbolt.org/)

**GPU Glossary (Modal)**  
  A one-stop glossary for GPU terms, from SMs to tensor cores. Perfect for quick lookups.  
  [Explore the glossary](https://modal.com/gpu-glossary)

---

## Scaling & Inference  
**Scaling ML Models (Google Engineers’ Guide)**  
  A comprehensive “systems thinking” book on scaling Transformers across accelerators. Covers roofline analysis, parallelism strategies, & inference trade-offs.  
  [Explore the guide](https://jax-ml.github.io/scaling-book/)

**Domain-Specific Architectures for AI Inference** (Fleetwood.dev)  
  A thoughtful post on how inference hardware is tuned for workloads like LLMs.  
  [Read the article](https://fleetwood.dev/posts/domain-specific-architectures)

**Fast LLM Inference From Scratch** (Andrew Chan)  
  A practical deep dive into implementing efficient inference kernels.  
  [Read the post](https://andrewkchan.dev/posts/yalm.html)

**LLM From Scratch: Automatic Differentiation** (Ben Clarkson)  
  A companion piece on building scalar autograd for LLMs.  
  [Read the article](https://bclarkson-code.com/posts/llm-from-scratch-scalar-autograd/post.html)

**Introduction to Cloud TPU (Google)**  
  For contrast with GPUs, this doc explains TPU architecture & use cases.  
  [Read the documentation](https://cloud.google.com/tpu/docs/intro-to-tpu)

---

This list is a work in progress, a personal map of the GPU/accelerator & scaling landscape. I’ll keep adding resources as I organize my read-list.
