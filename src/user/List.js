import React from 'react';
import styled from 'styled-components';

export default function List({ data, selectedCategory }) {
	return (
		<div>
			{selectedCategory === 'ev' ? (
				<Lists>현위치에서 가장 가까운 카페는 약 {data.nearest_cafe.km.toFixed(1)}km</Lists>
			) : (
				<Lists>현위치에서 가장 가까운 충전소는 약 {data.nearest_station.km.toFixed(1)}km</Lists>
			)}
		</div>
	);
}

const Lists = styled.li`
	display: flex;
	text-align: center;
	align-items: center;
	border-bottom: 1px dotted black;
	border-width: medium;
	justify-content: center;
	width: 290px;
	margin-top: 10px;
	magin-bottom: 7px;
	font-weight: 700;
`;
