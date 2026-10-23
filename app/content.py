"""Load site content from YAML and Markdown files under content/."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

import markdown
import yaml

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content"

CATEGORIES = {
    "research": "ML Research",
    "vision": "Computer Vision",
    "data": "Data & Analytics",
    "systems": "ML Systems & MLOps",
    "genai": "Generative AI",
}

PUBLICATION_TYPES = {
    "journal": "Journal",
    "conference": "Conference",
    "preprint": "Preprint",
    "workshop": "Workshop",
    "thesis": "Thesis",
}

MD_EXTENSIONS = ["tables", "attr_list", "md_in_html", "fenced_code", "footnotes", "toc", "smarty"]
MD_CONFIG = {"toc": {"toc_depth": "2-2", "permalink": False}}


def render_markdown(text: str) -> tuple[str, list[dict]]:
    """Render Markdown to HTML and return it with the list of h2 headings."""
    md = markdown.Markdown(extensions=MD_EXTENSIONS, extension_configs=MD_CONFIG)
    html = md.convert(text)
    toc = [{"id": t["id"], "name": t["name"]} for t in md.toc_tokens]
    return html, toc


def _read_yaml(path: Path):
    with path.open(encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def _split_front_matter(raw: str) -> tuple[dict, str]:
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", raw, re.S)
    if not match:
        return {}, raw
    return yaml.safe_load(match.group(1)) or {}, match.group(2)


@dataclass
class Project:
    slug: str
    title: str
    summary: str
    category: str
    body: str
    toc: list[dict]
    order: int = 100
    featured: bool = False
    thumbnail: str | None = None
    context: str | None = None
    period: str | None = None
    tags: list[str] = field(default_factory=list)
    facts: dict[str, str] = field(default_factory=dict)
    links: dict[str, str] = field(default_factory=dict)
    demo: dict = field(default_factory=dict)
    publication: str | None = None

    @property
    def category_label(self) -> str:
        return CATEGORIES.get(self.category, self.category)

    @property
    def has_demo(self) -> bool:
        return bool(self.demo.get("url") or self.demo.get("video"))


def load_profile() -> dict:
    return _read_yaml(CONTENT_DIR / "profile.yaml")


def load_projects() -> list[Project]:
    projects = []
    for path in sorted((CONTENT_DIR / "projects").glob("*.md")):
        meta, text = _split_front_matter(path.read_text(encoding="utf-8"))
        if meta.get("draft"):
            continue
        body, toc = render_markdown(text)
        projects.append(
            Project(
                slug=path.stem,
                title=meta["title"],
                summary=meta.get("summary", ""),
                category=meta.get("category", "research"),
                body=body,
                toc=toc,
                order=meta.get("order", 100),
                featured=meta.get("featured", False),
                thumbnail=meta.get("thumbnail"),
                context=meta.get("context"),
                period=meta.get("period"),
                tags=meta.get("tags") or [],
                facts=meta.get("facts") or {},
                links={k: v for k, v in (meta.get("links") or {}).items() if v},
                demo={k: v for k, v in (meta.get("demo") or {}).items() if v},
                publication=meta.get("publication"),
            )
        )
    return sorted(projects, key=lambda p: (p.order, p.title))


def _bibtex_name(name: str) -> str:
    parts = name.split()
    return name if len(parts) < 2 else f"{parts[-1]}, {' '.join(parts[:-1])}"


def _bibtex(pub: dict) -> str:
    entry_type = {"journal": "article", "conference": "inproceedings", "workshop": "inproceedings",
                  "thesis": "phdthesis"}.get(pub.get("type"), "misc")
    venue_field = {"article": "journal", "inproceedings": "booktitle"}.get(entry_type, "howpublished")
    fields = [
        ("title", "{" + pub["title"] + "}"),
        ("author", " and ".join(_bibtex_name(a) for a in pub["authors"])),
        (venue_field, pub.get("venue")),
        ("year", pub.get("year")),
        ("pages", str(pub["pages"]).replace("–", "--") if pub.get("pages") else None),
        ("publisher", pub.get("publisher")),
        ("doi", pub.get("doi")),
    ]
    lines = [f"  {k} = {{{v}}}" for k, v in fields if v]
    return f"@{entry_type}{{{pub['id']},\n" + ",\n".join(lines) + "\n}"


def load_publications() -> list[dict]:
    pubs = _read_yaml(CONTENT_DIR / "publications.yaml").get("publications") or []
    for pub in pubs:
        pub.setdefault("links", {})
        if pub.get("doi"):
            pub["links"].setdefault("doi", f"https://doi.org/{pub['doi']}")
        pub["type_label"] = PUBLICATION_TYPES.get(pub.get("type"), "")
        pub["bibtex"] = pub.get("bibtex") or _bibtex(pub)
    return sorted(pubs, key=lambda p: p.get("year", 0), reverse=True)
