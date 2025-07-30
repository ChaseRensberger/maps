import { useEffect, useState, useRef, type FC } from 'react';
import * as d3 from 'd3';

interface WorldMapProps {
	width: number;
	height: number;
	setSelectedCountry: any;
	canZoom?: boolean;
}

const WorldMap: FC<WorldMapProps> = ({ width, height, setSelectedCountry, canZoom = false }: WorldMapProps) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const container = svg.append('g');

		const projection = d3.geoMercator()
			.scale(200)
			.translate([width / 2, height / 2]);

		const path = d3.geoPath().projection(projection);
		const worldWidth = projection.scale() * 2 * Math.PI / projection.scale() * 200;

		if (canZoom) {
			const zoom = d3.zoom()
				.scaleExtent([1, 8])
				.on('zoom', (event: any) => {
					const { transform } = event;


					const maxY = height * 0.3;
					const minY = -height * 0.3;
					const constrainedY = Math.max(minY, Math.min(maxY, transform.y));

					const wrappedX = ((transform.x % worldWidth) + worldWidth) % worldWidth;

					const constrainedTransform = d3.zoomIdentity
						.translate(wrappedX, constrainedY)
						.scale(transform.k);

					container.attr('transform', constrainedTransform.toString());
				});

			(svg as any).call(zoom);
		}

		d3.json('/small-world.json').then((data: any) => {
			const copies = [-1, 0, 1, 2];

			copies.forEach(copyIndex => {
				const worldGroup = container.append('g')
					.attr('transform', `translate(${copyIndex * worldWidth}, 0)`);

				worldGroup.selectAll('path')
					.data(data.features)
					.enter()
					.append('path')
					.attr('d', (d: any) => path(d))
					.attr('fill', '#e5e7eb')
					.attr('stroke', '#9ca3af')
					.attr('stroke-width', 0.5)
					.attr('class', 'hover:fill-blue-200 transition-colors cursor-pointer')
					.on('mouseover', (_, d: any) => setSelectedCountry(d.properties.name));
			});
		});

	}, [width, height, canZoom]);

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

	const [selectedCountry, setSelectedCountry] = useState<string>("");
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
					{selectedCountry}
				</h1>
				<WorldMap width={900} height={600} setSelectedCountry={setSelectedCountry} canZoom />
			</div>
		</div>
	);
}
