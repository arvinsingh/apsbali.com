---
title: Building ToyGrad - A Journey Into the Heart of Automatic Differentiation
description: After years of using PyTorch, I finally built my own autograd engine from scratch to understand what really happens under the hood.
slug: toygrad-journey
date: Aug 3, 2025
published: True
---

For years, I've been working with PyTorch, building neural networks, training models, and marveling at how effortlessly <code>.backward()</code> computes gradients across complex computational graphs. It felt like magic - you define your forward pass, call a single method, and somehow PyTorch knows exactly how to propagate gradients back through every operation, every layer, every parameter.

But the curious part of me was never satisfied with just using this magic. *How does it actually work?* What happens when you call <code>.backward()</code>? How does PyTorch build and traverse computational graphs? These questions kept nagging at me, especially during late-night debugging sessions when I'd stare at gradient flows and wonder about the elegant mathematics happening behind the scenes.

So I decided to build my own autograd engine from scratch. Meet [ToyGrad](https://github.com/arvinsingh/toyGrad) - my personal exploration into the fundamentals of automatic differentiation.

## The "Why" Behind ToyGrad

Working as a Machine Learning Engineer, I've built countless models, implemented complex architectures, and optimized training loops. But there's something profoundly different between using a tool and truly understanding it. It's the difference between being a passenger and being the driver.

I wanted to understand:
- How computational graphs are built dynamically during forward passes
- How gradients flow backward through operations using the chain rule
- Why topological sorting is crucial for correct gradient computation
- How modern frameworks handle memory efficiently during backpropagation

PyTorch makes all of this invisible to the user (which is wonderful for productivity), but I needed to see the gears turning.

## Starting Simple: The <code>Special</code> Class

The heart of ToyGrad is the <code>Special</code> class—a scalar value that tracks gradients:

```python
class Special():
    def __init__(self, value, _prev=None, _op='', requires_grad=False):
        self.data = value
        self.grad = 0.0
        self._prev = _prev if _prev is not None else set()
        self._op = _op
        self.requires_grad = requires_grad
        self._backward = lambda: None
```

Each <code>Special</code> object knows:
- Its current value (<code>data</code>)
- Its gradient (<code>grad</code>)
- Which operations created it (<code>_prev</code> and <code>_op</code>)
- How to compute gradients for its inputs (<code>_backward</code>)

This is surprisingly similar to PyTorch tensors, just stripped down to the absolute essentials.

## Building the Computational Graph

The magic happens when you implement operations. Take multiplication:

```python
def __mul__(self, other):
    other = other if isinstance(other, Special) else Special(other)
    out = Special(self.data * other.data, (self, other), '*', 
                  self.requires_grad or other.requires_grad)

    def _backward():
        if self.requires_grad:
            self.grad += other.data * out.grad  # d/dx(xy) = y
        if other.requires_grad:
            other.grad += self.data * out.grad  # d/dy(xy) = x

    out._backward = _backward
    return out
```

Each operation creates a new node and stores exactly how to compute gradients for its inputs. The computational graph builds itself!

## The Backward Pass: Topological Sorting in Action

Here's where the real magic happens. When you call <code>.backward()</code>, ToyGrad needs to:

1. **Find all nodes** in the computational graph
2. **Sort them topologically** (ensuring dependencies are computed first)
3. **Apply the chain rule** by calling each node's <code>_backward</code> function

```python
def backward(self):
    topological_order = []
    visited = set()

    def build_topological_graph(node):
        if node not in visited:
            visited.add(node)
            for child in node._prev:
                build_topological_graph(child)
            topological_order.append(node)

    build_topological_graph(self)
    
    self.grad = 1.0  # Start with gradient of 1
    for node in reversed(topological_order):
        node._backward()
```

Watching this work for the first time was genuinely exciting. You could trace exactly how gradients flowed from the loss back to every parameter.

## Beyond Scalars: Building Neural Networks

Once the autograd engine worked, I built higher-level abstractions:

```python
class MLP(Module):
    def __init__(self, input_size, hidden_size, output_size, hidden_layers):
        super().__init__()
        self.layers = ModuleList()
        
        # Input layer
        self.layers.append(Linear(input_size, hidden_size))
        
        # Hidden layers
        for _ in range(hidden_layers):
            self.layers.append(Linear(hidden_size, hidden_size))
        
        # Output layer
        self.layers.append(Linear(hidden_size, output_size))

    def __call__(self, x):
        for layer in self.layers[:-1]:
            x = layer(x).tanh()  # Hidden layers with tanh activation
        x = self.layers[-1](x)   # Output layer (no activation)
        return x
```

The beautiful thing is that once you have automatic differentiation working, building neural networks becomes straightforward. Each layer is just a composition of operations that the autograd engine already knows how to differentiate.

## Testing on Real Problems

I tested ToyGrad on progressively complex problems:

1. **Simple optimization**: Minimizing <code>f(x) = (x - 3)^2</code>
2. **Logistic regression**: Binary classification with sigmoid activation
3. **Multi-layer networks**: Solving non-linear problems like the half-moons dataset

Here's what training a neural network looks like:

```python
# Create model and training setup
model = MLP(input_size=2, hidden_size=16, output_size=1, hidden_layers=3)
loss_fn = BCELoss()
optimizer = SGD(model.parameters(), lr=0.01)

# Training loop
for epoch in range(epochs):
    total_loss = SScalar(0.0)
    
    for x_batch, y_true in zip(X_data, y_data):
        # Forward pass
        logits = model(x_batch)
        y_pred = logits.sigmoid()
        loss = loss_fn(y_pred, y_true)
        total_loss += loss
        
        # Backward pass
        loss.backward()
    
    # Update parameters
    optimizer.step()
    model.zero_grad()
```

Seeing this work -- watching the loss decrease, gradients flow correctly, and the model learn -- was incredibly satisfying. This is exactly what PyTorch does, just without the optimizations and with full visibility into every step.

## What I Learned

Building ToyGrad taught me several profound lessons:

### 1. **Automatic Differentiation is Elegant**
The chain rule, implemented systematically, naturally handles arbitrarily complex computational graphs. There's no magic, just careful bookkeeping and mathematical rigor.

### 2. **Computational Graphs are Dynamic**
Unlike symbolic approaches, PyTorch (and ToyGrad) builds graphs during execution. This makes debugging easier and enables dynamic architectures, but requires careful memory management.

### 3. **Topological Sorting is Crucial**
You can't just compute gradients in any order. Dependencies matter, and topological sorting ensures gradients are computed correctly.

### 4. **Abstractions Build Naturally**
Once you have scalar automatic differentiation, building tensors, layers, and entire frameworks becomes a natural progression of abstractions.

## The PyTorch Connection

After building ToyGrad, I have a much deeper appreciation for PyTorch's sophistication:

- **Tensor operations**: PyTorch doesn't just handle scalars, it efficiently differentiates through complex tensor operations
- **Memory optimization**: Techniques like in-place operations and gradient checkpointing
- **CUDA integration**: Seamless GPU acceleration for both forward and backward passes
- **Advanced optimizers**: Adam, RMSprop, and others with sophisticated momentum and adaptive learning rates

But the core concepts are the same. PyTorch is essentially ToyGrad scaled up with industrial-strength optimizations.

## Beyond Understanding: Building Intuition

The most valuable outcome wasn't just understanding *how* automatic differentiation works, but developing intuition for *why* certain patterns emerge in deep learning:

- Why gradient clipping helps with training stability
- How different activation functions affect gradient flow
- Why certain architectures are more prone to vanishing gradients
- How batch normalization interacts with the computational graph

These insights directly improved my day-to-day work with PyTorch. When debugging training issues or designing new architectures, I now have a mental model of what's happening at the gradient level.

## The Code

You can explore the full implementation at [GitHub: ToyGrad](https://github.com/arvinsingh/toyGrad). The repository includes:

- Complete autograd engine implementation
- Neural network modules and layers
- Training utilities and optimizers
- Jupyter notebook with examples and experiments

## Final Thoughts

Building ToyGrad was one of those rare projects where the journey was more valuable than the destination. I didn't set out to compete with PyTorch (that would be absurd, but not impossible ;) ), but to understand the beautiful mathematics and computer science that makes modern deep learning possible.

If you've ever wondered what happens when you call <code>.backward()</code>, I encourage you to build your own autograd engine. Start simple, with scalars and basic operations. You'll be amazed at how quickly the magic becomes clear, logical, and elegant.

The next time you're training a complex transformer or debugging a tricky gradient flow issue, you'll have a deeper appreciation for the remarkable engineering that makes it all possible and the fundamental mathematics that makes it all work.

