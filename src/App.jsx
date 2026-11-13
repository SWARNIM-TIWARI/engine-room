import { useState, useEffect } from 'react'

const CAT = {
  knowledge: { label: 'Knowledge',  color: '#818cf8', glow: 'rgba(129,140,248,0.25)' },
  ai:        { label: 'AI Systems', color: '#c084fc', glow: 'rgba(192,132,252,0.25)' },
  systems:   { label: 'Systems',    color: '#22d3ee', glow: 'rgba(34,211,238,0.25)'  },
  hardware:  { label: 'Hardware',   color: '#fb923c', glow: 'rgba(251,146,60,0.25)'  },
  applied:   { label: 'Applied',    color: '#4ade80', glow: 'rgba(74,222,128,0.25)'  },
  security:  { label: 'Security',   color: '#f472b6', glow: 'rgba(244,114,182,0.25)' },
}

const TYPE_COLOR = { tool: '#fb923c', paper: '#818cf8', book: '#c084fc', course: '#4ade80' }



const TOPICS = [
  {
    id: 1, num: '01', icon: '🧠', cat: 'knowledge', name: 'Knowledge Graphs',
    tagline: "The engine behind Google just knowing things",
    concept: `Google knows the Eiffel Tower is in Paris and Paris is in France, so it answers "what country is the Eiffel Tower in" without a page ever saying those exact words. That chain of inference runs on a knowledge graph: entities (things) connected by named, typed relationships. Unlike a database of rows and columns, you traverse arbitrary connection chains in one query. Wikidata has 100 million items. Google's graph has 500 billion facts. The engineering problem is keeping those facts consistent and queryable at search latency as the graph never stops growing.`,
    techniques: [
      { name: 'RDF and SPARQL', desc: 'W3C standard for triple storage. Subject, predicate, object. SPARQL path expressions traverse billions of typed edges in milliseconds.' },
      { name: 'KG Embeddings (TransE, RotatE)', desc: 'Compress entities and relations into dense vectors where geometric operations encode semantic patterns. You can predict missing facts by doing math on these vectors.' },
      { name: 'Relational GNNs', desc: 'R-GCN and RGAT propagate information across heterogeneous edge types. Good for entity resolution, node classification, and finding things that should be connected but currently are not.' },
      { name: 'KGQA', desc: 'Natural language questions parsed into graph queries. Instead of fetching a document, you traverse the graph and return the answer directly. This is how voice assistants answer factual questions.' },
    ],
    code: `from pykeen.pipeline import pipeline

result = pipeline(
    model="TransE",
    dataset="FB15k237",
    training_kwargs=dict(num_epochs=100, batch_size=512),
    optimizer_kwargs=dict(lr=0.01),
)

preds = result.model.get_tail_prediction_df(
    "Q42",
    "educated_at",
    triples_factory=result.training,
)
print(preds.head(5))`,
    codeLang: 'python',
    frontier: 'Neuro-symbolic fusion is the active area: using KG facts as hard constraints during LLM decoding so the model cannot say something that contradicts a verified graph fact. Streaming KG updates from raw text without full retraining is the unsolved scalability side.',
    resources: [
      { name: 'PyKEEN', type: 'tool' }, { name: 'Wikidata Query Service', type: 'tool' },
      { name: 'Knowledge Graphs by Hogan et al. 2021', type: 'paper' }, { name: 'Neo4j GDS', type: 'tool' },
    ],
  },
  {
    id: 2, num: '02', icon: '🤖', cat: 'ai', name: 'Multi-Agent Systems',
    tagline: "When one model cannot do it alone, you build a team",
    concept: `When GPT-4 alone cannot architect, code, test, and deploy your feature, you split the work. One agent reads the spec, one writes the code, one reviews it, one runs the tests. That is a multi-agent system. The hard problem is not building one smart agent. It is making sure agents coordinate without conflicting on shared state and that you can assign credit when six agents contributed to one outcome. This same challenge appears in robotic swarms, financial market simulation, autonomous vehicle fleets, and any system where independent actors need to produce a coherent result without a central director.`,
    techniques: [
      { name: 'CTDE', desc: 'Centralized Training, Decentralized Execution. Train with global state visible, deploy with only local observations. MADDPG, QMIX, and MAPPO use this pattern.' },
      { name: 'Emergent Communication', desc: 'CommNet and DIAL let agents pass differentiable message vectors. Nobody designs the language. It emerges from what helps the team win. The results are alien but efficient.' },
      { name: 'Nash Equilibria', desc: 'A stable joint policy where no single agent can improve by switching unilaterally. The game theory anchor for analyzing agent behavior in competitive environments.' },
      { name: 'LLM Agent Orchestration', desc: 'AutoGen and CrewAI compose specialized LLM agents with shared memory, tool access, and role-based delegation. Modern MAS without the RL complexity.' },
    ],
    code: `from pettingzoo.mpe import simple_spread_v3

env = simple_spread_v3(N=3, max_cycles=100)
env.reset()

for agent in env.agent_iter():
    obs, reward, term, trunc, info = env.last()
    if term or trunc:
        action = None
    else:
        action = env.action_space(agent).sample()
    env.step(action)

env.close()`,
    codeLang: 'python',
    frontier: 'Decentralized LLM agents with persistent shared memory that stay coherent across thousands of turns are still an open problem. Scaling MARL beyond a few hundred agents without communication overhead eating all the gains is unsolved.',
    resources: [
      { name: 'PettingZoo', type: 'tool' }, { name: 'AutoGen by Microsoft Research', type: 'tool' },
      { name: 'MARL Book by Albrecht et al.', type: 'book' }, { name: 'Surprising Effectiveness of PPO in Cooperative MARL', type: 'paper' },
    ],
  },
  {
    id: 3, num: '03', icon: '🏗️', cat: 'systems', name: 'Distributed AI',
    tagline: "Training GPT-3 took 355 GPU-years. Someone had to split that up.",
    concept: `No single machine has 355 GPU-years to spare. Training a frontier model means spreading work across thousands of accelerators. The actual bottleneck is not the math. It is the time spent synchronizing gradient information across all those machines after every single training step. The history of this field is basically the history of making that sync cheaper. Data parallelism gives each machine its own copy of the model. Model parallelism splits the model itself across machines. ZeRO from DeepSpeed shards even the optimizer state so nothing is duplicated unnecessarily.`,
    techniques: [
      { name: 'Data Parallelism', desc: 'Each GPU holds a full model copy, processes its own mini-batch, then syncs gradients via ring all-reduce. The baseline approach. Works until the model does not fit in one GPU memory.' },
      { name: 'Tensor and Pipeline Parallelism', desc: 'Megatron-style tensor splitting distributes matrix operations across GPUs. GPipe scheduling keeps machines busy while other stages compute. Together they scale to hundreds of billions of parameters.' },
      { name: 'ZeRO Optimizer', desc: 'Shards optimizer states, gradients, and parameters across ranks independently. Reduces per-device memory by 8x compared to standard DDP with minimal extra communication.' },
      { name: 'Gradient Checkpointing', desc: 'Recomputes activations during backward pass instead of storing them. Trades about 30 percent extra compute for a proportional memory reduction.' },
    ],
    code: `import torch
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

dist.init_process_group(backend="nccl")
rank = dist.get_rank()

model = MyTransformer().to(rank)
model = DDP(model, device_ids=[rank])
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)

for batch in dataloader:
    optimizer.zero_grad()
    loss = model(batch.to(rank)).loss
    loss.backward()
    optimizer.step()`,
    codeLang: 'python',
    frontier: 'MoE routing across datacenter pods and fully async training without a global sync barrier are the active targets. 1-bit Adam and TopK gradient sparsification cut communication volume but introduce convergence risk that is still being characterized.',
    resources: [
      { name: 'DeepSpeed', type: 'tool' }, { name: 'Megatron-LM', type: 'tool' },
      { name: 'ZeRO by Rajbhandari et al. 2020', type: 'paper' }, { name: 'PyTorch FSDP', type: 'tool' },
    ],
  },
  {
    id: 4, num: '04', icon: '⚡', cat: 'hardware', name: 'GPU Architecture & CUDA',
    tagline: "A CPU has 16 fast cores. A GPU has 10000 slow ones. Neural nets love it.",
    concept: `Every matrix multiply in a neural network is thousands of multiplications that do not depend on each other. A CPU with 16 cores does them sequentially. A GPU with 10000 cores does them simultaneously. That gap in parallelism is why GPUs took over deep learning. The thing most people miss: the bottleneck is not the math, it is moving data from memory to the cores. GPU global memory feeds data at around 3 terabytes per second. The arithmetic units can consume it at 100 terabytes per second equivalent. Fast kernel writing means writing memory access patterns that keep those arithmetic units never waiting.`,
    techniques: [
      { name: 'Memory Coalescing', desc: 'Warp threads (32 threads sharing one instruction unit) that access contiguous addresses get served in one memory transaction. Non-contiguous access multiplies required bandwidth by up to 32x.' },
      { name: 'Shared Memory Tiling', desc: 'Load tiles of matrices into fast on-chip SRAM before computing. Each element is read from slow global memory once instead of N times. Speedup factor equals the tile width.' },
      { name: 'Tensor Core Operations', desc: 'Specialized hardware units executing 16x16x16 matrix fragments per warp per clock cycle. Used correctly they deliver 4 to 8x the throughput of regular CUDA cores for matrix math.' },
      { name: 'Occupancy Tuning', desc: 'Keep enough warps resident on each streaming multiprocessor so when one warp stalls on memory, another executes immediately. Register and shared memory usage per thread limits how many warps fit.' },
    ],
    code: `__global__ void matmul(float* A, float* B, float* C, int N) {
    __shared__ float sA[TILE][TILE], sB[TILE][TILE];
    int row = blockIdx.y * TILE + threadIdx.y;
    int col = blockIdx.x * TILE + threadIdx.x;
    float acc = 0.f;

    for (int t = 0; t < N / TILE; t++) {
        sA[threadIdx.y][threadIdx.x] = A[row*N + t*TILE + threadIdx.x];
        sB[threadIdx.y][threadIdx.x] = B[(t*TILE+threadIdx.y)*N + col];
        __syncthreads();
        for (int k = 0; k < TILE; k++)
            acc += sA[threadIdx.y][k] * sB[k][threadIdx.x];
        __syncthreads();
    }
    C[row * N + col] = acc;
}`,
    codeLang: 'cuda',
    frontier: 'FP8 training with Transformer Engine on Hopper GPUs and hand-written wgmma kernels approaching hardware peak throughput are the production edge. The Hopper TMA changes how async data movement works and the best Flash Attention implementations are being rewritten around it.',
    resources: [
      { name: 'CUDA By Example by Sanders & Kandrot', type: 'book' }, { name: 'Programming Massively Parallel Processors', type: 'book' },
      { name: 'CUTLASS', type: 'tool' }, { name: 'Triton Language', type: 'tool' },
    ],
  },
  {
    id: 5, num: '05', icon: '📡', cat: 'ai', name: 'Reinforcement Learning',
    tagline: "AlphaGo never read a textbook. It played Go 4.9 million times.",
    concept: `AlphaGo beat world champions without reading a single rule book. The only feedback was "you won" or "you lost" at the end of each game, repeated 4.9 million times. That loop is reinforcement learning: observe state, take action, receive reward, update. The Bellman equation is the math that makes value estimates propagate backward through time so the agent learns what moves lead to wins, not just what the last move was. RLHF is why language models sound like helpful assistants instead of statistical text randomizers. The math is the same as what beat Lee Sedol at Go.`,
    techniques: [
      { name: 'PPO (Proximal Policy Optimization)', desc: 'Clips the probability ratio between old and new policy during updates, preventing catastrophic policy changes. The de facto standard for on-policy RL in production. Used in ChatGPT RLHF training.' },
      { name: 'Soft Actor-Critic', desc: 'Maximizes both return and policy entropy, making the agent deliberately slightly random. Produces robust off-policy agents with high sample efficiency for continuous control problems.' },
      { name: 'Monte Carlo Tree Search', desc: 'Combines neural value and policy estimates with explicit look-ahead search. Planning plus learned intuition. The core of AlphaGo, AlphaZero, and MuZero.' },
      { name: 'Hindsight Experience Replay', desc: 'Relabels failed trajectories as "I was trying to reach where I actually ended up." Solves sparse reward problems without hand-engineering reward functions.' },
    ],
    code: `import torch

def compute_gae(rewards, values, gamma=0.99, lam=0.95):
    advantages = torch.zeros_like(rewards)
    last_adv = 0.0

    for t in reversed(range(len(rewards))):
        delta = rewards[t] + gamma * values[t+1] - values[t]
        advantages[t] = delta + gamma * lam * last_adv
        last_adv = advantages[t]

    returns    = advantages + values[:-1]
    advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)
    return advantages, returns`,
    codeLang: 'python',
    frontier: 'Offline RL from large human-generated datasets and RLAIF (replacing human labelers with AI feedback) are moving fast. Model-based RL that builds an internal world model and plans inside it like DreamerV3 is the next generalization target.',
    resources: [
      { name: 'Spinning Up in Deep RL by OpenAI', type: 'course' }, { name: 'Reinforcement Learning: An Introduction by Sutton & Barto', type: 'book' },
      { name: 'Gymnasium', type: 'tool' }, { name: 'Stable-Baselines3', type: 'tool' },
    ],
  },
  {
    id: 6, num: '06', icon: '🌍', cat: 'knowledge', name: 'Federated Learning',
    tagline: "Training on hospital data without the hospital emailing you anything",
    concept: `A hospital cannot email you patient records. A phone cannot upload your keystrokes to a server. Federated learning solves this by sending computation to data instead of data to computation. Each device or institution trains locally on its private data, then ships only model weight updates to a central server. The raw data never moves. Apple uses this for keyboard autocomplete on iPhone. Google uses it for on-device voice recognition. The hard ongoing problems are non-IID data (each client's data looks different from everyone else's), adversarial clients who try to poison the aggregate, and communication cost when you have a million devices each sending weight updates.`,
    techniques: [
      { name: 'FedAvg', desc: 'Weighted average of client updates proportional to local dataset size. The baseline. Fast, simple, works well when data distributions are not too different across clients.' },
      { name: 'DP-SGD', desc: 'Clip each per-sample gradient then add calibrated Gaussian noise before uploading. Gives formal differential privacy guarantees: a mathematical bound on what can be inferred about any individual from the update.' },
      { name: 'Secure Aggregation', desc: 'Cryptographic masking ensures the server sees only the sum of all updates, never any individual client gradient. Byzantine fault tolerance against clients sending malicious updates.' },
      { name: 'Personalized FL', desc: 'Per-FedAvg and MAML-based approaches maintain per-client model components. Handles the case where what is "correct" genuinely differs across users or institutions.' },
    ],
    code: `def fed_avg(client_updates, client_weights):
    total = sum(client_weights)
    aggregated = {}
    for key in client_updates[0]:
        aggregated[key] = sum(
            upd[key] * (w / total)
            for upd, w in zip(client_updates, client_weights)
        )
    return aggregated

updates  = [c.local_train() for c in selected_clients]
weights  = [len(c.local_dataset) for c in selected_clients]
new_w    = fed_avg(updates, weights)

for c in all_clients:
    c.update(new_w)`,
    codeLang: 'python',
    frontier: 'Federated fine-tuning of large language models across hospital networks is moving into production trials. Certified robustness against Byzantine clients who coordinate to backdoor the aggregate model is still theoretically incomplete.',
    resources: [
      { name: 'Flower Framework', type: 'tool' }, { name: 'PySyft', type: 'tool' },
      { name: 'Communication-Efficient Learning by McMahan et al. 2017', type: 'paper' }, { name: 'OpenFL by Intel', type: 'tool' },
    ],
  },
  {
    id: 7, num: '07', icon: '🔒', cat: 'security', name: 'AI Security',
    tagline: "Every model you ship is an attack surface. Few people test it like one.",
    concept: `An adversarially crafted image with invisible differences can make a self-driving car classify a stop sign as a speed limit sign. A few tokens injected into a retrieved document can make a language model ignore its system prompt. Model security is not a feature you add after deployment. It is a property you have to verify from the beginning because the threat model is every user, every prompt, every input the model will ever see. The field covers four main attack classes: evasion (fooling the model at inference), poisoning (corrupting training data), extraction (stealing the model via queries), and membership inference (figuring out whose data was in the training set).`,
    techniques: [
      { name: 'PGD (Projected Gradient Descent)', desc: 'Iteratively maximizes model loss while projecting perturbations back into an allowed norm ball after each step. The standard strong white-box attack. If your defense does not hold against PGD, it does not hold.' },
      { name: 'Certified Robustness', desc: 'Randomized smoothing converts any classifier into one with a mathematically certified accuracy guarantee under bounded perturbations. Not just empirically robust, provably robust within a radius.' },
      { name: 'Prompt Injection', desc: 'Malicious instructions embedded in retrieved context or tool outputs that override the system prompt. No complete defense exists. Current mitigations rely on structural sandboxing and instruction hierarchy.' },
      { name: 'Membership Inference', desc: 'Shadow model attacks train a meta-classifier to answer: did this example appear in training? Achieves 70 percent or higher accuracy on some models. Creates real legal and privacy liability.' },
    ],
    code: `import torch

def fgsm_attack(model, image, label, epsilon=0.03):
    image = image.clone().requires_grad_(True)
    loss  = torch.nn.CrossEntropyLoss()(model(image), label)
    model.zero_grad()
    loss.backward()
    return torch.clamp(image + epsilon * image.grad.sign(), 0, 1).detach()

correct = 0
for x, y in test_loader:
    x_adv    = fgsm_attack(model, x, y)
    correct += (model(x_adv).argmax(1) == y).sum().item()
print(f"Robust accuracy: {correct / len(test_dataset):.2%}")`,
    codeLang: 'python',
    frontier: 'Multimodal jailbreaks exploiting visual tokens to bypass LLM safety alignment are an active and underdefended attack surface. Automated red-teaming using RL to search for jailbreaks at scale is making both attack and defense faster simultaneously.',
    resources: [
      { name: 'Adversarial Robustness Toolbox by IBM', type: 'tool' }, { name: 'CleverHans', type: 'tool' },
      { name: 'Intriguing Properties of Neural Networks by Szegedy et al. 2013', type: 'paper' }, { name: 'Towards Deep Learning Models Resistant to Adversarial Attacks by Madry 2017', type: 'paper' },
    ],
  },
  {
    id: 8, num: '08', icon: '🧬', cat: 'knowledge', name: 'Causal Inference',
    tagline: "Ice cream sales and drowning deaths are correlated. Summer causes both.",
    concept: `Correlation does not mean causation. Everyone knows this. Almost nobody has the formal toolkit to do anything about it. Causal inference provides that toolkit: directed acyclic graphs for encoding what causes what, the do-calculus for computing what would happen if you intervened versus just observed, and potential outcomes for counterfactual reasoning. The difference between P(Y given X) and P(Y given do(X)) is everything. Your ML model sees the first. You actually want to know the second. Without this distinction, product decisions, policy interventions, and medical treatments built on correlational models routinely fail when deployed in the real world.`,
    techniques: [
      { name: 'DAGs and d-Separation', desc: 'Directed acyclic graphs encode your causal assumptions visually and formally. d-separation mechanically reads off which conditional independences hold. No regression required to understand the structure.' },
      { name: 'Do-Calculus', desc: "Pearl's three rules for computing interventional distributions from observational data given a causal graph. The mathematical answer to: when can we identify a causal effect from data we did not collect via experiment?" },
      { name: 'Instrumental Variables', desc: 'A variable that affects treatment but has no direct effect on outcome. Lets you estimate causal effects even with unmeasured confounders if a valid instrument exists.' },
      { name: 'Difference-in-Differences', desc: 'Compare outcome change over time between treated and untreated groups. Removes time-invariant confounders without needing to measure them, under a parallel-trends assumption.' },
    ],
    code: `from dowhy import CausalModel

model = CausalModel(
    data=df,
    treatment="hours_studied",
    outcome="exam_score",
    common_causes=["motivation", "prior_knowledge"],
    instruments=["school_randomization"]
)

estimand = model.identify_effect()
estimate  = model.estimate_effect(
    estimand,
    method_name="iv.instrumental_variable",
    test_significance=True,
)

refuter = model.refute_estimate(
    estimand, estimate, method_name="random_common_cause"
)
print(estimate, refuter)`,
    codeLang: 'python',
    frontier: 'Causal discovery from high-dimensional observational data using NOTEARS and DCDI is accelerating. Integrating causal structure into RL reward models so agents learn causal mechanisms instead of spurious correlations is an active direction.',
    resources: [
      { name: 'The Book of Why by Pearl & Mackenzie', type: 'book' }, { name: 'DoWhy', type: 'tool' },
      { name: 'Elements of Causal Inference by Peters et al.', type: 'book' }, { name: 'Causality by Pearl 2009', type: 'book' },
    ],
  },
  {
    id: 9, num: '09', icon: '🔍', cat: 'ai', name: 'Mechanistic Interpretability',
    tagline: "GPT-2 has a specific 3-head circuit that copies. Researchers actually found it.",
    concept: `Researchers found that GPT-2 contains a specific, identifiable circuit of three attention heads that together implement an induction operation. If the model has seen A then B earlier in context and sees A again, these three heads predict B next. Not "the model learned to copy" in some vague sense. Three specific heads, specific weight patterns, mathematically traced from input to output. The field's goal is to do this for every capability in every model until you have a complete wiring diagram. Right now that is possible for small models and specific behaviors. Scaling it to frontier models is the central open problem.`,
    techniques: [
      { name: 'Activation Patching', desc: 'Run the model on a corrupted input, then restore one specific activation back to its clean-run value. If the output improves, that component is causally responsible. Surgical, falsifiable, precise.' },
      { name: 'Sparse Autoencoders', desc: 'Train a sparse autoencoder on residual stream activations to decompose them into interpretable features. The core tool for addressing superposition, where one neuron represents multiple concepts at once.' },
      { name: 'Logit Lens', desc: 'Project intermediate residual stream states through the final unembedding matrix at each layer. Shows you what token the model would predict after layer N, watching the prediction evolve through the network.' },
      { name: 'Automated Circuit Discovery', desc: 'ACDC and EAP algorithmically search for the minimal subgraph of attention heads and MLPs responsible for a specific behavior, reducing what used to be weeks of manual analysis to hours.' },
    ],
    code: `from transformer_lens import HookedTransformer
import torch

model = HookedTransformer.from_pretrained("gpt2-small")
_, clean_cache = model.run_with_cache(clean_tokens)

def restore_head(act, hook, head_idx):
    act[:, :, head_idx, :] = clean_cache[hook.name][:, :, head_idx, :]
    return act

patched = model.run_with_hooks(
    corrupted_tokens,
    fwd_hooks=[(
        "blocks.7.attn.hook_result",
        lambda a, h: restore_head(a, h, 4)
    )]
)

recovery = (patched - corrupted_logits)[0, -1, correct_token].item()
print(f"Head 7.4 recovers {recovery:.3f} logits of correct answer")`,
    codeLang: 'python',
    frontier: 'The superposition hypothesis says features scale as neurons squared. Current SAE approaches may need 100x more capacity to fully cover a large model. Scaling circuit analysis to GPT-4 class models is the field\'s central unsolved problem.',
    resources: [
      { name: 'TransformerLens', type: 'tool' }, { name: 'A Mathematical Framework for Transformer Circuits by Elhage et al. 2021', type: 'paper' },
      { name: 'Toy Models of Superposition by Elhage et al. 2022', type: 'paper' }, { name: "Neel Nanda's Research Blog", type: 'course' },
    ],
  },
  {
    id: 10, num: '10', icon: '📈', cat: 'applied', name: 'AI for Operations Research',
    tagline: "UPS saved 100M miles of driving by avoiding left turns. Optimization won.",
    concept: `UPS ran the numbers: left turns waste fuel because you sit and idle waiting for traffic gaps. Eliminating most left turns from delivery routes saved 100 million miles per year. That is operations research, finding the best solution to a combinatorial problem that has too many possibilities to check by brute force. Routing 100 trucks optimally has more configurations than atoms in the observable universe. Exact solvers work for small instances. Neural combinatorial optimization learns heuristics from millions of problem instances and applies them in milliseconds to new ones the solver would take minutes on.`,
    techniques: [
      { name: 'Attention-Based Construction', desc: 'Pointer networks and attention models select nodes one by one to build a solution, trained via REINFORCE on objective quality. POMO achieves near-optimal results on 100-node TSP instances.' },
      { name: 'Learned Large Neighborhood Search', desc: 'Neural policies learn which parts of an existing solution to destroy and how to repair them. Outperforms hand-designed LNS operators on structured problem families.' },
      { name: 'Predict-Then-Optimize (SPO+)', desc: 'Backpropagate the downstream optimization objective through the optimization problem itself during training. Aligns your prediction model with decision quality, not just prediction accuracy.' },
      { name: 'RL for Real Scheduling', desc: 'DeepMind applied RL to Google data center cooling and VLSI chip placement, beating human expert solutions on real production instances. Training takes months. Inference runs in milliseconds.' },
    ],
    code: `import torch, torch.nn as nn

class AttentionDecoder(nn.Module):
    def __init__(self, d=128):
        super().__init__()
        self.q_proj = nn.Linear(d, d)
        self.k_proj = nn.Linear(d, d)
        self.C = 10.0

    def forward(self, context, nodes, mask):
        q      = self.q_proj(context).unsqueeze(1)
        k      = self.k_proj(nodes)
        logits = (q @ k.transpose(-2,-1)).squeeze(1) / (128**0.5)
        logits = self.C * torch.tanh(logits)
        logits[mask] = float("-inf")
        return logits.softmax(dim=-1)`,
    codeLang: 'python',
    frontier: 'LLM-guided branch-and-bound, where a language model suggests variable branching decisions inside a MIP solver, is genuinely new and working in preliminary experiments. Generalist models that transfer across TSP, VRP, and bin-packing without retraining are an open challenge.',
    resources: [
      { name: 'Google OR-Tools', type: 'tool' }, { name: 'Attention Learn to Solve Routing Problems by Kool et al. 2019', type: 'paper' },
      { name: 'POMO by Kwon et al. 2020', type: 'paper' }, { name: 'Gurobi', type: 'tool' },
    ],
  },
  {
    id: 11, num: '11', icon: '🏭', cat: 'applied', name: 'Digital Twins',
    tagline: "NASA simulated every Apollo 13 fix before transmitting it to the crew.",
    concept: `During the Apollo 13 crisis, engineers tested every potential fix on ground simulators before transmitting instructions to the crew 200000 miles away, because you do not run unvalidated experiments on a spacecraft with three people's lives on it. A digital twin is that simulator running continuously, synchronized with live sensor data from the real system. Not a one-time model but a live, updating computational mirror. Modern twins combine physics equations for what we understand, learned surrogate models for what is too complex to simulate from first principles, and Kalman filters for fusing noisy sensor streams into a coherent state estimate.`,
    techniques: [
      { name: 'Physics-Informed Neural Networks', desc: 'Embed PDE residuals directly into the loss function. The network learns solutions satisfying both observed data and governing physical equations. Extrapolates correctly in data-sparse regions.' },
      { name: 'Kalman and Particle Filters', desc: 'Sequential Bayesian state estimation. Takes a stream of noisy, partial, asynchronous sensor readings and maintains a probability distribution over the true system state at every timestep.' },
      { name: 'Neural Operators (FNO, DeepONet)', desc: 'Learn mappings between function spaces rather than just input-output pairs. Can generalize across different initial conditions and geometries. Run 1000x faster than physics simulation.' },
      { name: 'Mesh-Based GNNs', desc: 'Represent simulation domains as graphs where nodes are mesh points and edges connect neighbors. GNNs propagate physical fields across irregular geometries that CNNs cannot handle.' },
    ],
    code: `import torch, torch.nn as nn

class HeatPINN(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(2,64), nn.Tanh(),
            nn.Linear(64,64), nn.Tanh(),
            nn.Linear(64,1),
        )

    def forward(self, x, t):
        return self.net(torch.stack([x,t], dim=-1))

    def pde_residual(self, x, t, alpha=0.01):
        u   = self.forward(x, t)
        ut  = torch.autograd.grad(u.sum(), t, create_graph=True)[0]
        ux  = torch.autograd.grad(u.sum(), x, create_graph=True)[0]
        uxx = torch.autograd.grad(ux.sum(), x, create_graph=True)[0]
        return ut - alpha * uxx`,
    codeLang: 'python',
    frontier: 'Foundation models for simulation that generalize across physical domains without domain-specific retraining are the near-term target. Real-time biological digital twins for personalized medicine and surgical planning are entering clinical trials.',
    resources: [
      { name: 'DeepXDE by Lu et al.', type: 'tool' }, { name: 'NVIDIA Omniverse', type: 'tool' },
      { name: 'Fourier Neural Operator by Li et al. 2021', type: 'paper' }, { name: 'Learning to Simulate by Sanchez-Gonzalez et al. 2020', type: 'paper' },
    ],
  },
  {
    id: 12, num: '12', icon: '⚙️', cat: 'hardware', name: 'Compiler Design for ML',
    tagline: "The gap between naive PyTorch and compiled code is often 10 to 20x on the same GPU.",
    concept: `When you run a neural network in PyTorch naively, each operation dispatches individually to the GPU, reading and writing intermediate results to global memory between every single op. An ML compiler looks at the entire computation graph and asks: what can we fuse? What memory layout change would make this faster? What is the optimal tile size for this particular matrix shape on this particular GPU? Answering those questions can mean 10 to 20x speedup on identical hardware without changing the model at all. XLA is how Google runs TPU training at scale. TVM compiles to any hardware backend. Triton lets you write nearly-as-fast kernels in Python instead of CUDA.`,
    techniques: [
      { name: 'Operator Fusion', desc: 'Merge consecutive pointwise ops into a single kernel. The fused kernel never writes intermediate results to global memory. They stay in registers. This alone is often 2 to 4x for element-wise heavy models.' },
      { name: 'Auto-Tuning (Ansor, AutoTVM)', desc: 'Search over tile sizes, loop orderings, vectorization choices, and unrolling factors using ML to predict performance. Finds schedules that hand-tuning would miss.' },
      { name: 'Tensor IR (TIR)', desc: "TVM's low-level representation for expressing loop schedules explicitly. Lets compiler passes reason about and transform loops formally before emitting PTX or LLVM IR." },
      { name: 'MLIR Dialects', desc: 'Multi-level IR letting you define domain-specific abstractions at the right level, then progressively lower them to hardware instructions through composable passes. Infrastructure underlying XLA and IREE.' },
    ],
    code: `import tvm
from tvm import relay
import torch, torchvision

model  = torchvision.models.resnet18(pretrained=False).eval()
script = torch.jit.trace(model, torch.randn(1,3,224,224))

shape_list = [("input0", relay.TensorType([1,3,224,224],"float32"))]
mod, params = relay.frontend.from_pytorch(script, shape_list)

with tvm.transform.PassContext(opt_level=3):
    lib = relay.build(mod, target="cuda", params=params)

from tvm.contrib import graph_executor
m = graph_executor.GraphModule(lib["default"](tvm.cuda(0)))
m.set_input("input0", tvm.nd.array(torch.randn(1,3,224,224).numpy()))
m.run()`,
    codeLang: 'python',
    frontier: 'Stochastic superoptimization that searches schedule spaces orders of magnitude larger than Ansor is active. Compilation for dynamic shapes (variable sequence lengths, batch sizes) remains genuinely hard. Triton is making custom kernel writing accessible to ML researchers who do not know CUDA.',
    resources: [
      { name: 'Apache TVM', type: 'tool' }, { name: 'OpenXLA / XLA', type: 'tool' },
      { name: 'Triton Language', type: 'tool' }, { name: 'MLIR by Lattner et al. 2020', type: 'paper' },
    ],
  },
  {
    id: 13, num: '13', icon: '🚀', cat: 'hardware', name: 'Inference Optimization',
    tagline: "Serving a 70B model costs money every second. Here is how to make it hurt less.",
    concept: `Training a 70B parameter model costs roughly 2 million dollars and happens once. Serving it costs money every single second for the rest of its deployed life. The two dominant bottlenecks for autoregressive LLMs: memory bandwidth (you reload all 70B parameters from memory for every single generated token) and KV cache memory (keys and values from all previous tokens must stay in GPU memory, growing linearly with context length). INT4 quantization cuts the weight loading cost by 4x with under 1 percent quality loss. Speculative decoding uses a tiny fast model to draft 4 tokens, then verifies all 4 in parallel with the big model. 3x throughput with identical output.`,
    techniques: [
      { name: 'Post-Training Quantization (GPTQ, AWQ)', desc: 'Compress 16-bit weights to 4-bit by finding per-layer scale factors minimizing quantization error. Under 1 percent quality loss on most benchmarks. Serves a 70B model on two consumer GPUs instead of four datacenter ones.' },
      { name: 'Speculative Decoding', desc: 'A small cheap draft model generates K candidate tokens. The large target model scores all K+1 positions in one forward pass and accepts a prefix. 2 to 3x wall-clock speedup with identical output distribution.' },
      { name: 'Paged KV Cache (vLLM)', desc: "Manages KV cache in fixed-size pages of non-contiguous GPU memory, like virtual memory in an OS. Eliminates fragmentation from variable-length requests. 2 to 4x throughput improvement in practice." },
      { name: 'Flash Attention', desc: 'Tiled attention keeping Q, K, V in on-chip SRAM throughout computation. Reduces HBM I/O from O(N squared) to O(N). Enables context lengths in the hundreds of thousands without memory exploding.' },
    ],
    code: `import torch

def speculative_decode(draft_model, target_model, prompt_ids, K=4):
    ids = prompt_ids.clone()

    while not is_eos(ids):
        with torch.no_grad():
            draft_out  = draft_model.generate(ids, max_new_tokens=K)
        candidates = draft_out[:, ids.shape[1]:]

        full_seq = torch.cat([ids, candidates], dim=1)
        with torch.no_grad():
            logits = target_model(full_seq).logits

        accepted = verify_and_correct(logits, candidates, ids.shape[1])
        ids = torch.cat([ids, accepted], dim=1)

    return ids`,
    codeLang: 'python',
    frontier: 'Disaggregated prefill/decode serving runs the two phases on separate GPU pools to maximize utilization. Sub-1B models approaching 7B quality on domain-specific tasks via distillation and structured pruning are landing on device at scale.',
    resources: [
      { name: 'vLLM', type: 'tool' }, { name: 'FlashAttention by Dao et al. 2022', type: 'paper' },
      { name: 'llama.cpp', type: 'tool' }, { name: 'TensorRT-LLM by NVIDIA', type: 'tool' },
    ],
  },
]

/* ─── Wikipedia ─────────────────────────────────────────────────────────────── */
const WIKI_QUERIES = {
  1: 'knowledge graph semantic web', 2: 'multi-agent system AI',
  3: 'distributed artificial intelligence', 4: 'CUDA parallel computing Nvidia',
  5: 'reinforcement learning', 6: 'federated learning machine learning',
  7: 'adversarial machine learning security', 8: 'causal inference statistics',
  9: 'explainable artificial intelligence', 10: 'operations research optimization',
  11: 'digital twin simulation technology', 12: 'XLA machine learning compiler',
  13: 'large language model inference',
}

async function fetchWiki(topicId, topicName) {
  const q = WIKI_QUERIES[topicId] || topicName
  try {
    const r1 = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=3&format=json&origin=*`
    )
    const d1 = await r1.json()
    const hits = d1?.query?.search
    if (!hits?.length) return null
    for (const hit of hits) {
      try {
        const r2 = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`
        )
        const d2 = await r2.json()
        if (d2.extract && d2.extract.length > 60 && !d2.detail) {
          return {
            title:   d2.title,
            extract: d2.extract.length > 480 ? d2.extract.slice(0, 480) + '…' : d2.extract,
            url:     d2.content_urls?.desktop?.page,
          }
        }
      } catch {}
    }
    return null
  } catch { return null }
}

/* ─── Aurora ────────────────────────────────────────────────────────────────── */
function Aurora() {
  return (
    <div className="aurora" aria-hidden>
      <div className="blob blob-1" /><div className="blob blob-2" />
      <div className="blob blob-3" /><div className="blob blob-4" />
    </div>
  )
}

/* ─── Small pieces ──────────────────────────────────────────────────────────── */
function CatBadge({ cat, small }) {
  const c = CAT[cat]
  return (
    <span style={{ fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: '.04em', color: c.color, background: `${c.color}18`, border: `1px solid ${c.color}35`, borderRadius: 8, padding: small ? '2px 8px' : '4px 10px', whiteSpace: 'nowrap' }}>
      {c.label}
    </span>
  )
}

function SLabel({ text, color }) {
  return <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color, marginBottom: 10 }}>{text}</div>
}

/* ─── Tab panels ────────────────────────────────────────────────────────────── */
function Overview({ topic, wiki, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <SLabel text="What it is" color={color} />
        <p style={{ fontSize: 14, lineHeight: 1.85, color: 'rgba(240,240,255,0.7)' }}>{topic.concept}</p>
      </section>
      <section>
        <SLabel text="What is still being figured out" color={color} />
        <p style={{ fontSize: 14, lineHeight: 1.85, color: 'rgba(240,240,255,0.7)' }}>{topic.frontier}</p>
      </section>
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <SLabel text="Wikipedia" color={color} />
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.1em', color: '#4ade80', border: '1px solid #4ade8050', padding: '2px 7px', borderRadius: 6, animation: 'pulse 2.5s infinite', marginBottom: 10 }}>LIVE</span>
        </div>
        {wiki === 'loading' && <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Loading…</p>}
        {wiki === null && <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>Could not load Wikipedia entry.</p>}
        {wiki && wiki !== 'loading' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${color}`, borderRadius: '0 10px 10px 0', padding: '14px 16px' }}>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(240,240,255,0.5)', marginBottom: 10 }}>{wiki.extract}</p>
            {wiki.url && <a href={wiki.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color, fontWeight: 600 }}>Read on Wikipedia →</a>}
          </div>
        )}
      </section>
      <section>
        <SLabel text="Resources" color={color} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {topic.resources.map((r, i) => {
            const tc = TYPE_COLOR[r.type] || '#888'
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6, border: `1px solid ${tc}40`, background: `${tc}12`, color: tc }}>{r.type}</span>
                <span style={{ fontSize: 13, color: 'rgba(240,240,255,0.5)' }}>{r.name}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Techniques({ topic, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {topic.techniques.map((t, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f0ff', marginBottom: 5 }}>{t.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(240,240,255,0.5)', lineHeight: 1.65 }}>{t.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Code({ topic, color }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(topic.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600, color, letterSpacing: '.1em', textTransform: 'uppercase' }}>{topic.codeLang}</span>
        <button onClick={copy} style={{ background: copied ? `${color}20` : 'rgba(255,255,255,0.06)', border: `1px solid ${copied ? color + '50' : 'rgba(255,255,255,0.1)'}`, borderRadius: 9, color: copied ? color : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, padding: '5px 13px', cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="code-block" style={{ '--cat': color }}>{topic.code}</div>
    </div>
  )
}

/* ─── Modal ─────────────────────────────────────────────────────────────────── */
const TABS = ['overview', 'techniques', 'code']

function Modal({ topic, wiki, onClose }) {
  const [tab, setTab] = useState('overview')
  const [dragStartX, setDragStartX] = useState(null)
  const [dragStartY, setDragStartY] = useState(null)
  const c = CAT[topic.cat]

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const onPointerDown = (e) => { setDragStartX(e.clientX); setDragStartY(e.clientY) }
  const onPointerUp   = (e) => {
    if (dragStartX === null) return
    const dx = dragStartX - e.clientX
    const dy = Math.abs(dragStartY - e.clientY)
    if (Math.abs(dx) > dy && Math.abs(dx) > 55) {
      const idx = TABS.indexOf(tab)
      if (dx > 0 && idx < 2) setTab(TABS[idx + 1])
      if (dx < 0 && idx > 0) setTab(TABS[idx - 1])
    }
    setDragStartX(null); setDragStartY(null)
  }

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-card" style={{ '--glow': c.glow, display: 'flex', flexDirection: 'column', maxHeight: '88vh', background: '#0b0b1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 22, boxShadow: `0 8px 48px rgba(0,0,0,0.85), 0 0 40px ${c.glow}` }}>
        {/* Glow stripe */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${c.color}00, ${c.color}, ${c.color}00)`, flexShrink: 0 }} />

        {/* Scrollable body */}
        <div
          style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', padding: '22px 22px 28px', flex: 1 }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 32, background: `${c.color}18`, border: `1px solid ${c.color}30`, borderRadius: 14, width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{topic.icon}</span>
              <div>
                <div style={{ marginBottom: 4 }}><CatBadge cat={topic.cat} small /></div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f0f0ff', letterSpacing: '-.02em' }}>{topic.name}</h2>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.4)', width: 34, height: 34, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, background: tab === t ? `${c.color}25` : 'rgba(255,255,255,0.05)', border: `1px solid ${tab === t ? c.color + '50' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, padding: '8px 4px', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit', boxShadow: tab === t ? `0 0 16px ${c.glow}` : 'none', transition: 'all .18s' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Swipe hint */}
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', textAlign: 'center', marginBottom: 16, letterSpacing: '.05em' }}>
            swipe left or right to switch tabs
          </div>

          {/* Content */}
          {tab === 'overview'   && <Overview   topic={topic} wiki={wiki} color={c.color} />}
          {tab === 'techniques' && <Techniques topic={topic}             color={c.color} />}
          {tab === 'code'       && <Code       topic={topic}             color={c.color} />}
        </div>
      </div>
    </div>
  )
}

/* ─── Topic card ────────────────────────────────────────────────────────────── */
function TopicCard({ topic, onClick }) {
  const c = CAT[topic.cat]
  return (
    <div className="clay" onClick={onClick} style={{ '--glow': c.glow, padding: '22px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 8, right: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 44, fontWeight: 800, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{topic.num}</div>
      <div style={{ fontSize: 28, background: `${c.color}15`, border: `1px solid ${c.color}25`, borderRadius: 12, width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{topic.icon}</div>
      <div style={{ marginBottom: 8 }}><CatBadge cat={topic.cat} small /></div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f0ff', letterSpacing: '-.02em', marginBottom: 6, lineHeight: 1.25 }}>{topic.name}</div>
      <div style={{ fontSize: 12.5, color: 'rgba(240,240,255,0.4)', lineHeight: 1.55 }}>{topic.tagline}</div>
    </div>
  )
}

/* ─── App ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [selected,  setSelected]  = useState(null)
  const [wikiCache, setWikiCache] = useState({})

  const open = async (topic) => {
    setSelected(topic)
    document.body.style.overflow = 'hidden'
    if (!(topic.id in wikiCache)) {
      setWikiCache(c => ({ ...c, [topic.id]: 'loading' }))
      const data = await fetchWiki(topic.id, topic.name)
      setWikiCache(c => ({ ...c, [topic.id]: data }))
    }
  }

  const close = () => { setSelected(null); document.body.style.overflow = '' }

  return (
    <>
      <Aurora />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '52px 20px 0' }}>

        <header style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(240,240,255,0.3)', letterSpacing: '.08em', marginBottom: 12 }}>
            by Swarnim Tiwari
          </div>
          <h1 style={{ fontSize: 'clamp(52px,9vw,92px)', fontWeight: 800, color: '#f0f0ff', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 18 }}>
            Engine Room
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(240,240,255,0.45)', maxWidth: 500, lineHeight: 1.7, marginBottom: 28 }}>
            Thirteen systems running underneath every AI product. Tap any card to go deep.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {Object.entries(CAT).map(([k, c]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.3)', fontWeight: 500 }}>{c.label}</span>
              </div>
            ))}
          </div>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16, marginBottom: 60 }}>
          {TOPICS.map(t => <TopicCard key={t.id} topic={t} onClick={() => open(t)} />)}
        </main>

        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '24px 0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f0ff', marginBottom: 3 }}>Swarnim Tiwari</div>
            <div style={{ fontSize: 12, color: 'rgba(240,240,255,0.3)' }}>Interested in what comes next.</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/swarnimtiwari1', color: '#818cf8' }, { label: 'GitHub', href: 'https://github.com/SWARNIM-TIWARI', color: '#c084fc' }].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,240,255,0.3)', transition: 'color .15s' }} onMouseEnter={e => e.currentTarget.style.color = l.color} onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,240,255,0.3)'}>{l.label}</a>
            ))}
          </div>
        </footer>
      </div>

      {selected && <Modal topic={selected} wiki={wikiCache[selected.id]} onClose={close} />}
    </>
  )
}
