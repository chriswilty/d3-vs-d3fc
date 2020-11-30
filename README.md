# Building a bar chart: D3 vs D3FC

I must admit, I'd forgotten how convenient it is to build charts using
[D3FC](https://d3fc.io/), until I revisited it recently to compare it with vanilla
[D3](https://d3js.org/). One goal of D3FC was to provide a higher-level API than
D3, to make it simple to generate a chart with very little code using sensible
defaults, while at the same time exposing the D3 API to allow customising the
resulting chart in a familiar way. D3FC exposes D3 via its
[Decorate pattern](https://github.com/d3fc/d3fc/blob/master/docs/decorate-pattern.md).

My intention here is not to knock the brilliant D3, but rather to show that it
is possible to have the best of both worlds: low-level, precision customisation
of SVG and Canvas charts together with a higher-level API: put a chart on a page
in very little time, then tinker with it until you (and your clients) are happy.

This project started as a comparison of an annotated bar chart (from
[this D3FC tutorial](https://github.com/d3fc/d3fc/blob/master/docs/building-a-chart.md)),
but when I find time I'll add more charts of different types.
