"""
LangGraph FinOps Agent Graph Construction.
Assembles the complete state graph matching agent_mermaid.png.
"""

from __future__ import annotations

from typing import Optional
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph

from Agents.nodes.cost_correlator import cost_correlator_node
from Agents.nodes.hitl_gate import hitl_gate_node
from Agents.nodes.observability import observability_node
from Agents.nodes.optimization_synthesizer import optimization_synthesizer_node
from Agents.nodes.reporter import reporter_node
from Agents.nodes.terraform_executor import terraform_executor_node
from Agents.nodes.terraform_inventory import terraform_inventory_node
from Agents.nodes.verification import verification_node
from Agents.state import FinOpsState
from Agents.supervisor import supervisor_node, supervisor_route_fn


def create_finops_graph(checkpointer: Optional[BaseCheckpointSaver] = None):
    """
    Builds and compiles the FinOps multi-agent LangGraph workflow.
    Topology matches agent_mermaid.png with complete fidelity:

    START -> supervisor
             ├── ① (no inventory)            -> terraform_inventory -> supervisor
             ├── ② (no metrics)              -> observability       -> supervisor
             ├── ③ (no waste)                -> cost_correlator     -> supervisor
             ├── ④ (no proposals)            -> optimization_synthesizer -> supervisor
             ├── ⑤ (no approval yet)         -> hitl_gate           -> supervisor
             ├── ⑥ (approved • not executed) -> terraform_executor  -> supervisor
             ├── ⑦ (executed • not verified) -> verification        -> supervisor
             └── ⑧ (done OR error)           -> reporter            -> END
    """
    if checkpointer is None:
        checkpointer = MemorySaver()

    builder = StateGraph(FinOpsState)

    # 1. Register All Nodes
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("terraform_inventory", terraform_inventory_node)
    builder.add_node("observability", observability_node)
    builder.add_node("cost_correlator", cost_correlator_node)
    builder.add_node("optimization_synthesizer", optimization_synthesizer_node)
    builder.add_node("hitl_gate", hitl_gate_node)
    builder.add_node("terraform_executor", terraform_executor_node)
    builder.add_node("verification", verification_node)
    builder.add_node("reporter", reporter_node)

    # 2. Add Entrypoint: START -> supervisor
    builder.add_edge(START, "supervisor")

    # 3. Add Supervisor's Conditional Routing
    builder.add_conditional_edges(
        "supervisor",
        supervisor_route_fn,
        {
            "terraform_inventory": "terraform_inventory",
            "observability": "observability",
            "cost_correlator": "cost_correlator",
            "optimization_synthesizer": "optimization_synthesizer",
            "hitl_gate": "hitl_gate",
            "terraform_executor": "terraform_executor",
            "verification": "verification",
            "reporter": "reporter",
        },
    )

    # 4. Add Worker Loop-backs to Supervisor
    builder.add_edge("terraform_inventory", "supervisor")
    builder.add_edge("observability", "supervisor")
    builder.add_edge("cost_correlator", "supervisor")
    builder.add_edge("optimization_synthesizer", "supervisor")
    builder.add_edge("hitl_gate", "supervisor")
    builder.add_edge("terraform_executor", "supervisor")
    builder.add_edge("verification", "supervisor")

    # 5. Terminal Edge: reporter -> END
    builder.add_edge("reporter", END)

    # 6. Compile with Checkpointer
    return builder.compile(checkpointer=checkpointer)
