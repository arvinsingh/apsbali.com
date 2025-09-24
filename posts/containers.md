---
title: Filesystem Illusion Inside Containers
description: A concise look at the filesystem illusion that makes containers feel like virtual machines.
slug: containers
date: Sep 16, 2025
published: True
---

When I first started working with containers, I had a fundamental misunderstanding. I thought Docker was somehow packaging entire operating systems into these lightweight bundles. How else could an Ubuntu container run on my CentOS server? It took me months to realize I was looking at this completely backwards.

Containers don't contain operating systems. They contain *the illusion* of operating systems. & once you understand how this illusion is crafted, you'll never look at containers the same way again.

## Misconception That Started Everything

Let's start with what containers *aren't*. They're not mini virtual machines. They don't have their own kernels. They don't even have their own filesystems, not really. When you run <code>docker run ubuntu:latest</code>, you're not booting Ubuntu. You're starting a process that *thinks* it's running on Ubuntu.

This realization hit me when I discovered that every container on my system was sharing the exact same kernel:

```bash
# From the host
uname -r
# 5.4.0-74-generic

# From inside any container
docker run ubuntu uname -r  
# 5.4.0-74-generic

# Same kernel, different worlds
```

So how does this work? How can the same kernel present completely different realities to different processes?

## Kernel's Greatest Feature - Namespaces

The secret lies in Linux namespaces - a kernel feature that lets you create parallel universes for processes. Think of namespaces as filters that change what a process can see, without changing what actually exists.

Here's the key insight: when you create a new namespace, you're not creating new resources. You're creating a new *view* of existing resources.

Let me show you the most important namespace for containers - the mount namespace

```bash
# Terminal 1: Create our parallel universe
sudo unshare --mount bash

# Terminal 2: In the "real" world, create a file
echo "Reality check" > /tmp/reality.txt

# Back to Terminal 1: We can see it
cat /tmp/reality.txt  # "Reality check"

# But now watch this magic trick
# In Terminal 1, let's change what /tmp points to
sudo mount --bind /var/log /tmp
ls /tmp  # Now shows log files, not the reality.txt file!

# Meanwhile, in Terminal 2
ls /tmp  # Still shows reality.txt
```

We've just created two different realities. Same filesystem, same files, but different views of where <code>/tmp</code> points.

## Dissecting the Container Creation Process

Now let's build our own container runtime to understand exactly how this illusion is constructed. But instead of following the typical tutorial approach, let's reverse-engineer it by asking: "What would a process need to believe it's running in a completely different Linux distribution?"

### Question 1: "What makes a Linux distribution unique?"

From a process perspective, it's mostly files in specific locations:
- <code>/etc/os-release</code> - tells you what distro this is
- <code>/bin</code>, <code>/usr/bin</code> - where programs live
- <code>/lib</code> - where libraries live
- <code>/etc</code> - where configuration lives

### Question 2: "What kernel interfaces does every Linux process expect?"

- <code>/proc</code> - process & system information
- <code>/dev</code> - device files
- <code>/sys</code> - system information & control

### Question 3: "What makes a process feel isolated?"

- Its own process tree (PID namespace)
- Its own hostname (UTS namespace)  
- Its own network interfaces (network namespace)
- Its own view of mounted filesystems (mount namespace)

Let's build this step by step, but with a twist - we'll do it by creating the minimum viable illusion.

## Building Minimum Viable Container

Instead of following a recipe, let's think like a magician. What's the smallest trick we can perform that makes a process believe it's in a different world?

### Foundation with Different Root

Every Linux process believes the world starts at <code>/</code>. If we can change what <code>/</code> points to, we can change everything the process sees:

```bash
# Get some different "world" to point to
mkdir /tmp/fake-world
echo "I'm in a different universe!" > /tmp/fake-world/hello.txt

# Create our namespace laboratory  
sudo unshare --mount bash

# Now for the magic trick - change what root means
mount --bind /tmp/fake-world /tmp/fake-world
cd /tmp/fake-world
mkdir old-root
pivot_root . old-root

# Look around - we're in a different world!
ls /  # Just shows hello.txt
cat /hello.txt  # "I'm in a different universe!"

# The old world still exists, but it's hidden
ls /old-root  # There's the original filesystem
```

Congratulations! You've just created the world's simplest container. A process started here would think the entire universe consists of one text file.

### Making It Believable by Adding Expected Pieces

Of course, a real container needs to be more convincing. Let's add the pieces that make a Linux environment feel real:

```bash
# Let's get a proper Linux filesystem to work with
mkdir -p /opt/container-lab
cd /opt/container-lab

# Borrow Ubuntu's filesystem structure
curl -s https://partner-images.canonical.com/core/focal/current/ubuntu-focal-core-cloudimg-amd64-root.tar.gz | \
tar xz -C .

# Now let's create our illusion properly
sudo unshare --mount --pid --fork --uts --net bash

# Set up the stage
CONTAINER_ROOT="/opt/container-lab"
mount --make-private /
mount --bind $CONTAINER_ROOT $CONTAINER_ROOT

# The crucial part - making /proc work
mount -t proc proc $CONTAINER_ROOT/proc

# The other essential lies the kernel tells
mount -t tmpfs tmpfs $CONTAINER_ROOT/dev
mount -t sysfs sysfs $CONTAINER_ROOT/sys

# Now for the grand reveal
cd $CONTAINER_ROOT
mkdir -p .old
pivot_root . .old
exec chroot . /bin/bash

# Set our identity in this new world
hostname "my-container"
echo "my-container" > /etc/hostname

# Clean up the evidence
umount /.old
rmdir .old
```

### Devil in the Details

What we've built works, but it's missing the subtle touches that make containers production-ready. Real container runtimes handle dozens of edge cases:

1. *Device Management* - Containers need specific device files but not others
2. *Security Boundaries* - Some parts of <code>/proc</code> & <code>/sys</code> are too dangerous to expose
3. *Resource Limits* - The container should feel isolated but not escape resource controls
4. *Network Plumbing* - Containers need their own network stack but ways to communicate

Here's how we add just one of these - proper device management:

```bash
# Instead of exposing all devices, create just what we need
cd /dev
mknod null c 1 3
mknod zero c 1 5  
mknod random c 1 8
mknod urandom c 1 9

# Create the illusion of a terminal
mknod tty c 5 0

# Standard streams should work
ln -s /proc/self/fd stdin
ln -s /proc/self/fd/1 stdout  
ln -s /proc/self/fd/2 stderr
```

## Understanding Layers

Layers are a *storage optimization*, not a container requirement. Our container works perfectly without any layer system. We just copied files into a directory. Docker's layers are about sharing common files between containers & managing updates efficiently, not about creating isolation.

You could run production containers with our simple approach. You'd just use more disk space & have slower startup times.

## Storage Illusion: Volumes vs Bind Mounts

Here's another place where Docker's marketing creates confusion. Docker presents "volumes" & "bind mounts" as fundamentally different concepts:

```bash
# Docker makes these seem different
docker run -v /host/path:/container/path myimage    # bind mount
docker run -v myvolume:/container/path myimage      # volume
```

But under the hood? They're identical. Both are just bind mounts created before the <code>pivot_root</code> operation. The only difference is that Docker manages the host directory location for "volumes" (usually under <code>/var/lib/docker/volumes/</code>), while "bind mounts" let you specify the host path directly.

When you understand that containers are just filtered views of the host filesystem, this makes perfect sense. Whether the source directory is <code>/home/user/data</code> or <code>/var/lib/docker/volumes/abc123/_data</code>, the mechanism is identical: <code>mount --bind source destination</code>.

Of course, Docker's abstraction is useful for lifecycle management, portability & driver support.

## It's All About Perspective

What we've built demonstrates the profound insight that containers are fundamentally about *perspective*. We haven't created new operating systems or even new filesystems. We've created new *viewpoints* on the same underlying system.

This perspective shift explains so many container behaviors that seem mysterious:

- Why containers start so fast (no OS to boot)
- Why they share resources so efficiently (same kernel)
- Why security is both easier & harder (shared kernel, isolated view)
- Why networking is complicated (network namespaces vs. shared networking)
- Why volumes & bind mounts are the same thing (both are just directories made visible; difference is in management)


## From Docker Command to Running Container

Now that we understand the fundamental mechanisms, let's see how Docker orchestrates all these pieces when you run a simple command. The journey from <code>docker run</code> to a running container involves multiple layers, but at its core, it's still just the namespace & mount tricks we've been exploring.

Here's the complete flow:

```
docker run <image>
   │
   ├─► Docker CLI
   │       - Parses args
   │       - Talks to Docker daemon (dockerd)
   │
   ├─► Docker daemon
   │       - Pulls image if not local
   │       - Assembles root filesystem (from layers)
   │       - Creates OCI bundle (rootfs + config.json)
   │       - Asks containerd to run the container
   │
   ├─► containerd (long-running container manager)
   │       - Manages images & container lifecycle
   │       - Spawns shim process (containerd-shim) to monitor container
   │       - Calls runc with the OCI bundle
   │
   └─► runc (low-level runtime, short-lived)
           ├─ clone() / unshare() → create namespaces
           │     - PID, mount, network, UTS, IPC, user
           │
           ├─ setns() → join existing namespaces if needed
           │
           ├─ cgroups setup → apply CPU/memory/io limits
           │
           ├─ mount() / pivot_root() → switch to container rootfs
           │
           ├─ drop capabilities / apply seccomp/AppArmor/SELinux
           │
           └─ execve() → start container process (PID 1 inside)
           
(containerd-shim keeps the container alive after runc exits)
```

This entire complex orchestration is doing one fundamental thing: creating a sophisticated set of "perspective filters" for a single process. The process believes it owns an entire Linux system, but it's really just looking at the world through these carefully crafted illusions.

The actual container creation happens in that bottom section - the <code>runc</code> part. Everything else (Docker daemon, containerd) is just management, orchestration, & image handling. The real magic still comes down to the same Linux primitives we've been exploring:

- <code>clone()</code> & <code>unshare()</code> - create the namespace filters
- <code>mount()</code> & <code>pivot_root()</code> - switch the filesystem view
- <code>execve()</code> - start the process in its new reality

Docker's complexity isn't in creating containers - it's in managing them at scale.

## Why This Matters

Container technology isn't magic - it's an elegant application of existing Linux kernel features. Understanding the underlying mechanisms helps you:

- Debug container issues by understanding what isolation is missing
- Make informed decisions about container security models
- Optimize container performance by understanding the overhead sources
- Design better container-based systems by working with the abstractions, not against them

The illusion is sophisticated, beautiful in its simplicity, & powerful in its application.
