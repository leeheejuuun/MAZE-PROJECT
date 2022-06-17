import React from 'react';
import styled, { css } from 'styled-components';

export default function TypebatteryButton({ data, handleClick, isClicked }) {
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
				background-color: #14c9f2;
				border: 1px solid rgba(0, 0, 0, 0.2);
				color: #fff;
				margin-right: 5px;
				padding: 5px;
				font-weight: 600;
			`;
		} else {
			return css`
				border-radius: 10px;
				background-color: #fff;
				border: 1px solid rgba(0, 0, 0, 0.4);
				color: #14c9f2;
				margin-right: 5px;
				padding: 5px;
				font-weight: 600;
			`;
		}
	}};
`;
