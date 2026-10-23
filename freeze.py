"""Build the static site into build/ for GitHub Pages."""
from pathlib import Path

from flask_frozen import Freezer

from app import asset_urls, create_app, project_urls

app = create_app()
freezer = Freezer(app)
freezer.register_generator(asset_urls)
freezer.register_generator(project_urls)
freezer.register_generator(lambda: ["/404.html", "/robots.txt", "/sitemap.xml"])

if __name__ == "__main__":
    freezer.freeze()
    build = Path(app.config["FREEZER_DESTINATION"])
    # Pages would otherwise run Jekyll over the pre-built HTML.
    (build / ".nojekyll").touch()
    print(f"Built site into {build}")
