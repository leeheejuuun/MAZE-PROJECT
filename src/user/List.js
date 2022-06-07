import React from 'react';
import styled from 'styled-components';

export default function List({ data, selectedCategory }) {
	return (
		<>
			{selectedCategory === 'ev' ? (
				<Lists>당신에게서 가장 가까운 카페는 ? : 약 {data.search_range.km.toFixed(1)}km</Lists>
			) : (
				<Lists>당신에게서 가장 가까운 충전소는 ? : 약 {data.search_range.km.toFixed(1)}km</Lists>
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
