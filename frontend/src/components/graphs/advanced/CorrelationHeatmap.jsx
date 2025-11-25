import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CorrelationHeatmap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const correlation = [
      { x: "HPI", y: "HPI", value: 1.0 },
      { x: "HPI", y: "HEI", value: 0.84 },
      { x: "HPI", y: "Cd", value: 0.41 },
      { x: "HPI", y: "MI", value: -0.32 },
      { x: "HPI", y: "CI+ML", value: 0.12 },
      { x: "HEI", y: "HPI", value: 0.84 },
      { x: "HEI", y: "HEI", value: 1.0 },
      { x: "HEI", y: "Cd", value: 0.57 },
      { x: "HEI", y: "MI", value: -0.28 },
      { x: "HEI", y: "CI+ML", value: 0.18 },
      { x: "Cd", y: "HPI", value: 0.41 },
      { x: "Cd", y: "HEI", value: 0.57 },
      { x: "Cd", y: "Cd", value: 1.0 },
      { x: "Cd", y: "MI", value: -0.44 },
      { x: "Cd", y: "CI+ML", value: -0.1 },
      { x: "MI", y: "HPI", value: -0.32 },
      { x: "MI", y: "HEI", value: -0.28 },
      { x: "MI", y: "Cd", value: -0.44 },
      { x: "MI", y: "MI", value: 1.0 },
      { x: "MI", y: "CI+ML", value: 0.25 },
      { x: "CI+ML", y: "HPI", value: 0.12 },
      { x: "CI+ML", y: "HEI", value: 0.18 },
      { x: "CI+ML", y: "Cd", value: -0.1 },
      { x: "CI+ML", y: "MI", value: 0.25 },
      { x: "CI+ML", y: "CI+ML", value: 1.0 },
    ].map((d) => ({ ...d, value: +d.value.toFixed(2) }));

    const margin = { top: 80, right: 140, bottom: 80, left: 100 };
    const size = 420;
    const width = size + margin.left + margin.right;
    const height = size + margin.top + margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("font-family", "Inter, sans-serif")
      .style("background", "#fff");

    svg.selectAll("*").remove();

    const xLabels = Array.from(new Set(correlation.map((d) => d.x)));
    const yLabels = Array.from(new Set(correlation.map((d) => d.y))).reverse();

    const xScale = d3.scaleBand().domain(xLabels).range([0, size]);
    const yScale = d3.scaleBand().domain(yLabels).range([0, size]);

    // Custom color scale based on given palette
    const colorScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range([
        "rgba(53, 83, 132, 1)", // deep blue
        "rgba(42, 185, 122, 1)", // green
        "rgba(154, 218, 128, 1)", // light green
      ]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.7)")
      .style("color", "white")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Draw cells
    g.selectAll("rect")
      .data(correlation)
      .join("rect")
      .attr("x", (d) => xScale(d.x))
      .attr("y", (d) => yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.value))
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(150).style("opacity", 1);
        tooltip.html(
          `<strong>${d.x} - ${d.y}</strong><br/>Correlation: ${d.value}`
        );
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).style("opacity", 0);
        d3.select(this).attr("stroke", "none");
      });

    // Add text values
    g.selectAll("text.cell-value")
      .data(correlation)
      .join("text")
      .attr("class", "cell-value")
      .attr("x", (d) => xScale(d.x) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.y) + yScale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#000")
      .style("font-size", "11px")
      .text((d) => d.value.toFixed(2));

    // Axes
    g.append("g")
      .attr("transform", `translate(0, ${size})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "13px");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "13px");

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "600")
      .text("Correlation Heatmap");

    // Subtitle
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#555")
      .text("Shows correlation strength between indices (–1 to +1)");

    // Color legend
    const legendHeight = 220;
    const legendWidth = 14;

    const legendSvg = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left + size + 50}, ${margin.top + 60})`
      );

    const legendScale = d3.scaleLinear().domain([-1, 1]).range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale).tickValues([-1, 0, 1]);

    // Gradient for legend
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "custom-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    gradient
      .selectAll("stop")
      .data([
        { offset: "0%", color: "rgba(53, 83, 132, 1)" },
        { offset: "50%", color: "rgba(42, 185, 122, 1)" },
        { offset: "100%", color: "rgba(154, 218, 128, 1)" },
      ])
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    legendSvg
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#custom-gradient)");

    legendSvg
      .append("g")
      .attr("transform", `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .selectAll("text")
      .style("font-size", "12px");

    // Legend labels
    legendSvg
      .append("text")
      .attr("x", -36)
      .attr("y", legendHeight + 22)
      .style("font-size", "12px")
      .text("Low correlation (–1)");

    legendSvg
      .append("text")
      .attr("x", 22)
      .attr("y", legendHeight / 2 + 20)
      .style("font-size", "12px")
      .text("Moderate (0)");

    legendSvg
      .append("text")
      .attr("x", -36)
      .attr("y", -13)
      .style("font-size", "12px")
      .text("High correlation (+1)");

    // Cleanup tooltip on unmount
    return () => tooltip.remove();
  }, []);

  return (
    <div className="graph-card" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "500px",
      maxHeight:"650px",
    }}  >
      <svg ref={svgRef} style={{ display: "block" }}></svg>
    </div>);
};

export default CorrelationHeatmap;
