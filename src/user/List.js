import React from 'react';
import styled from 'styled-components';

export default function List({ data, selectedCategory }) {
	return (
		<>
			{selectedCategory === 'ev' ? (
				<Lists>
					현위치에서 가장 가까운 카페는 약 {data.nearest_cafe.km.toFixed(1)}km 거리에 있습니다.
				</Lists>
			) : (
				<Lists>
					현위치에서 가장 가까운 충전소는 약 {data.nearest_station.km.toFixed(1)}km 거리에 있습니다.
				</Lists>
			)}
		</>
	);
}

const Lists = styled.li`
	display: flex;
	text-align: center;
	align-items: center;
	height: 30px;
`;
