console.log("Log is voor noobs");
var data = [{
  name: "hostnet.nl.",
  value: 463226
}, {
  name: "metaregistrar.nl.",
  value: 370038
}, {
  name: "transip.net.",
  value: 326939
}, {
  name: "firstfind.nl.",
  value: 266901
}, {
  name: "rzone.de.",
  value: 152024
}, {
  name: "axc.nl.",
  value: 119233
}, {
  name: "argewebhosting.eu.",
  value: 104033
}, {
  name: "transip.nl.",
  value: 94597
}, {
  name: "one.com.",
  value: 79338
}, {
  name: "openprovider.nl.",
  value: 71996
}, {
  name: "hosting2go.nl.",
  value: 68545
}, {
  name: "flexwebhosting.nl.",
  value: 67685
}, {
  name: "sonexo.eu.",
  value: 67618
}, {
  name: "webhostingserver.nl.",
  value: 63405
}, {
  name: "kpn.net.",
  value: 63169
}, {
  name: "webreus.nl.",
  value: 61679
}, {
  name: "pcextreme.nl.",
  value: 53115
}, {
  name: "undeveloped.com.",
  value: 51768
}, {
  name: "tiscomhosting.nl.",
  value: 49968
}, {
  name: "ns0.nl.",
  value: 48348
}, {
  name: "sedoparking.com.",
  value: 45094
}, {
  name: "neostrada.nl.",
  value: 44570
}, {
  name: "bit.nl.",
  value: 35043
}, {
  name: "vevida.net.",
  value: 34996
}, {
  name: "is.nl.",
  value: 34873
}, {
  name: "mijndnsserver.nl.",
  value: 33779
}, {
  name: "leaseweb.nl.",
  value: 27263
}, {
  name: "anony.nl.",
  value: 25467
}, {
  name: "xs4all.nl.",
  value: 25421
}, {
  name: "byte.nl.",
  value: 23766
}, {
  name: "dootall.com.",
  value: 23399
}, {
  name: "eatserver.nl.",
  value: 22174
}, {
  name: "oxilion.nl.",
  value: 21505
}, {
  name: "cloudflare.com.",
  value: 20424
}, {
  name: "domaincontrol.com.",
  value: 20243
}, {
  name: "widexs.nl.",
  value: 19676
}, {
  name: "vip.nl.",
  value: 19511
}, {
  name: "dnstools.nl.",
  value: 18665
}, {
  name: "2is.nl.",
  value: 18644
}, {
  name: "deziweb.com.",
  value: 17299
}, {
  name: "blixem.nl.",
  value: 16698
}, {
  name: "netground.nl.",
  value: 16656
}, {
  name: "exonet.nl.",
  value: 16490
}, {
  name: "thednscompany.com.",
  value: 15829
}, {
  name: "dn-s.nl.",
  value: 15618
}, {
  name: "bhosted.nl.",
  value: 15243
}, {
  name: "masterdns.nl.",
  value: 14733
}, {
  name: "active24.cz.",
  value: 14666
}, {
  name: "xel.nl.",
  value: 14343
}, {
  name: "yoursrs.com.",
  value: 14048
}];
var text = "";

var width = 260;
var height = 260;
var thickness = 40;
var duration = 750;

var radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#chart")
.append('svg')
.attr('class', 'pie')
.attr('width', width)
.attr('height', height);

var g = svg.append('g')
.attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

var arc = d3.arc()
.innerRadius(radius - thickness)
.outerRadius(radius);

var pie = d3.pie()
.value(function(d) { return d.value; })
.sort(null);

var path = g.selectAll('path')
.data(pie(data))
.enter()
.append("g")
.on("mouseover", function(d) {
      let g = d3.select(this)
        .style("cursor", "pointer")
        .style("fill", "black")
        .append("g")
        .attr("class", "text-group");

      g.append("text")
        .attr("class", "name-text")
        .text(`${d.data.name}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '-1.2em');

      g.append("text")
        .attr("class", "value-text")
        .text(`${d.data.value}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '.6em');
    })
  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .style("fill", color(this._current))
        .select(".text-group").remove();
    })
  .append('path')
  .attr('d', arc)
  .attr('fill', (d,i) => color(i))
  .on("mouseover", function(d) {
      d3.select(this)
        .style("cursor", "pointer")
        .style("fill", "black");
    })
  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .style("fill", color(this._current));
    })
  .each(function(d, i) { this._current = i; });


g.append('text')
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')
  .text(text);
