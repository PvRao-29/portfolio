from __future__ import annotations

import os
from dataclasses import dataclass
from typing import List, Tuple

import numpy as np
from PIL import Image


THEME = {
    "background": (245, 242, 233),
    "ink": (45, 45, 45),
    "muted": (120, 113, 108),
    "accent": (180, 83, 9),
    "grid": (212, 207, 196),
}


@dataclass(frozen=True)
class LifeConfig:
    grid_width: int = 100
    grid_height: int = 60
    cell_size: int = 8
    seed: int = 29
    alive_prob: float = 0.30
    frames: int = 120
    frame_duration_ms: int = 125
    output_file: str = "GameOfLife.gif"


class Life:
    """Conway's Game of Life with toroidal wrapping."""

    def __init__(self, width: int, height: int, seed: int = 29, alive_prob: float = 0.30):
        self.width = int(width)
        self.height = int(height)
        rng = np.random.RandomState(seed)
        self.state = rng.random((self.height, self.width)) < alive_prob

    def step(self) -> None:
        """Advance one generation using vectorized neighbor counting with toroidal wrapping."""
        s = self.state.astype(np.uint8)

        n = (
            np.roll(np.roll(s, 1, axis=0), 1, axis=1) +
            np.roll(s, 1, axis=0) +
            np.roll(np.roll(s, 1, axis=0), -1, axis=1) +
            np.roll(s, 1, axis=1) +
            np.roll(s, -1, axis=1) +
            np.roll(np.roll(s, -1, axis=0), 1, axis=1) +
            np.roll(s, -1, axis=0) +
            np.roll(np.roll(s, -1, axis=0), -1, axis=1)
        )

        alive = self.state
        self.state = (alive & ((n == 2) | (n == 3))) | (~alive & (n == 3))


def _draw_grid(img: Image.Image, cell_size: int, grid_color: Tuple[int, int, int]) -> None:
    """Draw grid lines onto the image in place."""
    w, h = img.size
    px = img.load()
    for x in range(0, w, cell_size):
        for y in range(h):
            px[x, y] = grid_color
    for y in range(0, h, cell_size):
        for x in range(w):
            px[x, y] = grid_color


def render_state(state: np.ndarray, cell_size: int, theme=THEME) -> Image.Image:
    """Render a Life state into a PIL image using the provided theme."""
    h, w = state.shape
    img = Image.new("RGB", (w * cell_size, h * cell_size), color=theme["background"])
    _draw_grid(img, cell_size, theme["grid"])

    px = img.load()
    alive_color = theme["ink"]

    ys, xs = np.nonzero(state)
    for y, x in zip(ys.tolist(), xs.tolist()):
        ox, oy = x * cell_size, y * cell_size
        for dy in range(cell_size - 1):
            for dx in range(cell_size - 1):
                px[ox + dx, oy + dy] = alive_color

    return img


def generate_gif(cfg: LifeConfig) -> str:
    """Generate and save a Game of Life GIF animation."""
    print(f"Generating Game of Life animation ({cfg.grid_width}x{cfg.grid_height})...")
    print(f"Generating {cfg.frames} frames...")

    life = Life(cfg.grid_width, cfg.grid_height, seed=cfg.seed, alive_prob=cfg.alive_prob)
    frames: List[Image.Image] = []

    for i in range(cfg.frames):
        if i % 20 == 0:
            print(f"  Frame {i}/{cfg.frames}")
        frames.append(render_state(life.state, cfg.cell_size))
        life.step()

    print(f"Saving animation to {cfg.output_file}...")
    frames[0].save(
        cfg.output_file,
        save_all=True,
        append_images=frames[1:],
        duration=cfg.frame_duration_ms,
        loop=0,
        optimize=False,
    )

    size_mb = os.path.getsize(cfg.output_file) / (1024 * 1024)
    abs_path = os.path.abspath(cfg.output_file)
    print(f"✓ Animation saved! File size: {size_mb:.2f} MB")
    print(f" Location: {abs_path}")
    return abs_path


if __name__ == "__main__":
    generate_gif(LifeConfig())