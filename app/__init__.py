"""Flask application for the portfolio site.

Run locally with `flask --app app run --debug`; build the static site for
GitHub Pages with `python freeze.py`.
"""
from __future__ import annotations

from datetime import date

from flask import Flask, Response, abort, render_template, send_from_directory, url_for
from markupsafe import Markup

from .content import CATEGORIES, ROOT, load_profile, load_projects, load_publications, render_markdown

ASSETS_DIR = ROOT / "assets"


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["FREEZER_DESTINATION"] = str(ROOT / "build")
    app.config["FREEZER_REMOVE_EXTRA_FILES"] = True

    @app.template_filter("md")
    def md_filter(text: str) -> Markup:
        return Markup(render_markdown(text or "")[0])

    @app.template_filter("highlight_author")
    def highlight_author(name: str) -> Markup:
        me = load_profile()["name"]
        return Markup("<strong>{}</strong>").format(name) if name == me else Markup.escape(name)

    @app.context_processor
    def inject_globals():
        return {"profile": load_profile(), "categories": CATEGORIES, "year": date.today().year}

    @app.route("/")
    def index():
        projects = load_projects()
        publications = load_publications()
        return render_template(
            "index.html",
            featured=[p for p in projects if p.featured],
            publications=[p for p in publications if p.get("selected")] or publications,
            all_publications=publications,
        )

    @app.route("/publications.html")
    def publications():
        projects = {p.slug: p for p in load_projects()}
        return render_template("publications.html", publications=load_publications(), projects=projects)

    @app.route("/projects/")
    def projects():
        return render_template("projects.html", projects=load_projects())

    @app.route("/projects/<slug>.html")
    def project(slug: str):
        projects = load_projects()
        index = next((i for i, p in enumerate(projects) if p.slug == slug), None)
        if index is None:
            abort(404)
        pubs = {p["id"]: p for p in load_publications()}
        current = projects[index]
        return render_template(
            "project.html",
            project=current,
            publication=pubs.get(current.publication),
            prev_project=projects[index - 1] if index > 0 else None,
            next_project=projects[index + 1] if index + 1 < len(projects) else None,
        )

    @app.route("/assets/<path:filename>")
    def assets(filename: str):
        return send_from_directory(ASSETS_DIR, filename)

    @app.route("/404.html")
    def not_found_page():
        return render_template("404.html")

    @app.errorhandler(404)
    def not_found(_error):
        return render_template("404.html"), 404

    @app.route("/robots.txt")
    def robots():
        site = load_profile()["site_url"].rstrip("/")
        return Response(f"User-agent: *\nAllow: /\n\nSitemap: {site}/sitemap.xml\n", mimetype="text/plain")

    @app.route("/sitemap.xml")
    def sitemap():
        site = load_profile()["site_url"].rstrip("/")
        paths = [url_for("index"), url_for("publications"), url_for("projects")]
        paths += [url_for("project", slug=p.slug) for p in load_projects()]
        xml = render_template("sitemap.xml", urls=[site + p for p in paths], today=date.today().isoformat())
        return Response(xml, mimetype="application/xml")

    return app


def asset_urls():
    """Every file under assets/, for the static freezer."""
    for path in ASSETS_DIR.rglob("*"):
        if path.is_file():
            yield "assets", {"filename": path.relative_to(ASSETS_DIR).as_posix()}


def project_urls():
    for project in load_projects():
        yield "project", {"slug": project.slug}
