import React from 'react';
import styled from 'styled-components';

export default function DistanceButton({ handleClickDistance }) {
	return (
		<>
			<Btn type="button" value="250m" onClick={handleClickDistance}>
				250m
			</Btn>
			<Btn type="button" value="500m" onClick={handleClickDistance}>
				500m
			</Btn>
			<Btn type="button" value="1KM" onClick={handleClickDistance}>
				1km
			</Btn>
		</>
	);
}

const Btn = styled.button`
	border-radius: 10px;
	background-color: #14c9f2;
	height: 22px;
	color: #fff;
	border: none;
	margin-right: 5px;
`;
