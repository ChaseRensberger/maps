import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface WorldMapProps {
	width: number;
	height: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ width, height }: WorldMapProps) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove(); // Clear previous render

		const projection = d3.geoMercator()
			.scale(130)
			.translate([width / 2, height / 2]);

		const path = d3.geoPath().projection(projection);

		d3.json('/world.json').then((data: any) => {
			svg.selectAll('path')
				.data(data.features)
				.enter()
				.append('path')
				.attr('d', path)
				.attr('fill', '#e5e7eb')
				.attr('stroke', '#9ca3af')
				.attr('stroke-width', 0.5)
				.attr('class', 'hover:fill-blue-200 transition-colors cursor-pointer');
		});
	}, [width, height]);

	return (
		<div className="w-full h-full flex justify-center items-center">
			<svg
				ref={svgRef}
				width={width}
				height={height}
				className="border border-gray-300 rounded-lg shadow-lg"
			/>
		</div>
	);
};

export default function App() {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
					World Map
				</h1>
				<WorldMap width={900} height={600} />
			</div>
		</div>
	);
}
