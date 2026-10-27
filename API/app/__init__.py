"""
AI FinOps Platform.
Ensures root workspace containing 'Agents' package is in sys.path.
"""

import sys
from pathlib import Path

# Ensure root workspace directory is in sys.path
_ROOT_DIR = str(Path(__file__).resolve().parent.parent.parent)
if _ROOT_DIR not in sys.path:
    sys.path.insert(0, _ROOT_DIR)