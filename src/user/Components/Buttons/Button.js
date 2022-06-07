import React from 'react';
import styled, { css } from 'styled-components';

export default function Button({ data, handleClick, isClicked }) {
	return (
		<Btn onClick={handleClick} isClicked={isClicked} className="button" type="button">
			{data}
		</Btn>
	);
}

const Btn = styled.button`
	${({ isClicked }) => {
		if (isClicked) {
			return css`
				border-radius: 10px;
				background-color: #3d8ba8;
				border: 1px solid rgba(0, 0, 0, 0.3);
				color: #fff;
			`;
		} else {
			return css`
				border-radius: 10px;
				background-color: #fff;
				border: 1px solid rgba(0, 0, 0, 0.3);
				color: #3d8ba8;
			`;
		}
	}};
`;
