import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const navigate = useNavigate();
	const ID = 'maze';
	const PW = 'maze!';

	const handleSubmit = e => {
		e.preventDefault();

		if (e.target[0].value === ID && e.target[1].value === PW) {
			navigate('user');
		} else {
			alert('아이디 및 비밀번호를 확인 해 주세요.');
			return;
		}

		navigate('user');
		sessionStorage.setItem('isLogin', 'true');
	};

	useEffect(() => {
		console.log(sessionStorage.getItem('isLogidddn'));
		if (sessionStorage.getItem('isLogin')) {
			navigate('user');
		}
	}, [navigate]);

	return (
		<Wrap>
			<LoginWrap>
				<LogoImgWrap>
					<LogoImg
						src={`${process.env.PUBLIC_URL}/images/4120f6cb-c521-4a53-9da3-1d4c029e3f7b-removebg-preview.png`}
					/>
				</LogoImgWrap>
				<InputWrap onSubmit={handleSubmit}>
					<Input Login placeholder="아이디를 입력해 주세요" />
					<Input type="password" PassWord placeholder="비밀번호를 입력해 주세요" />
					<Btn type="submit">로그인</Btn>
				</InputWrap>
			</LoginWrap>
		</Wrap>
	);
}

const Wrap = styled.div`
	display: flex;
	justify-content: center;
`;
const LoginWrap = styled.div`
	width: 350px;
	height: 600px;
`;

const LogoImgWrap = styled.div`
	display: flex;
	justify-content: center;
`;

const LogoImg = styled.img`
	width: 300px;
	margin-top: 150px;
`;

const Input = styled.input`
	width: ${props => (props.Login || props.PassWord ? '250px' : '0px')};
	margin-bottom: 20px;
	border-radius: 10px;
	border: 1px solid rgba(0, 0, 0, 0.5);
	padding: 5px;
`;

const InputWrap = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 50px;
	width: 100%;
`;

const Btn = styled.button`
	width: 250px;
	border: 1px solid rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	padding: 10px;
`;
