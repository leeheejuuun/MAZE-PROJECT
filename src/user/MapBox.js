import React, { useEffect, useRef, useState } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import EventMarkerContainer from './EventMarkerContainer';
import Button from './Components/Buttons/Button';
import dd from '../user/csvjson.json';
import './MapBox.scss';
import styled from 'styled-components';

const MapBox = () => {
	const { kakao } = window;
	const markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png';
	const imageSize = { width: 22, height: 26 };
	const spriteSize = { width: 36, height: 98 };
	const coffeeOrigin = { x: 10, y: 0 };
	const evOrigin = { x: 10, y: 36 };

	const [state, setState] = useState({
		// 지도의 초기 위치
		center: { lat: null, lng: null },

		// 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
		isPanto: true,
		errMsg: null,
		isLoading: false,
	});
	// 다중필터링 담는 state
	const [filterList, setFilterList] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('ev');
	const [level, setLevel] = useState(4);
	const [area, setArea] = useState({});
	const [meta, setMeta] = useState([
		{
			type: [
				{ id: 1, title: 'DC차데모' },
				{ id: 2, title: 'AC완속' },
				{ id: 3, title: 'AC상' },
				{ id: 4, title: 'DC콤보' },
			],
			battery: [
				{ id: 1, title: '3kw' },
				{ id: 2, title: '7kw' },
				{ id: 3, title: '50kw' },
				{ id: 4, title: '14kw' },
				{ id: 5, title: '40kw' },
				{ id: 6, title: '50kw' },
				{ id: 7, title: '100kw' },
				{ id: 8, title: '175kw' },
				{ id: 9, title: '200kw' },
				{ id: 10, title: '260kw' },
				{ id: 11, title: '350kw' },
			],
		},
	]);

	useEffect(() => {
		if (navigator.geolocation) {
			// GeoLocation을 이용해서 접속 위치를 얻어옵니다
			navigator.geolocation.getCurrentPosition(
				position => {
					setState(prev => ({
						...prev,
						center: {
							lat: position.coords.latitude, // 위도
							lng: position.coords.longitude, // 경도
						},
						isLoading: false,
					}));
				},
				err => {
					setState(prev => ({
						...prev,
						errMsg: err.message,
						isLoading: false,
					}));
				},
			);
		} else {
			// HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
			setState(prev => ({
				...prev,
				errMsg: 'geolocation을 사용할수 없어요..',
				isLoading: false,
			}));
		}
	}, []);

	useEffect(() => {
		const coffeeMenu = document.getElementById('coffeeMenu');
		const evMenu = document.getElementById('evMenu');

		if (selectedCategory === 'coffee') {
			coffeeMenu.className = 'menu_selected';
			evMenu.className = '';
		} else if (selectedCategory === 'ev') {
			coffeeMenu.className = '';
			evMenu.className = 'menu_selected';
		}
	}, [selectedCategory]);

	const [searchAddress, setSearchAddress] = useState();

	const handleSearchAddress = e => {
		setSearchAddress(e.target.value);
	};

	// 키워드 입력후 검색 클릭 시 원하는 키워드의 주소로 이동
	const SearchMap = () => {
		const place = new kakao.maps.services.Places();
		const placesSearch = function (data, status, pagination) {
			if (status === kakao.maps.services.Status.OK) {
				const newSearch = data[0];
				setState({
					center: { lat: newSearch.y, lng: newSearch.x },
				});
			}
		};
		place.keywordSearch(`${searchAddress}`, placesSearch);
	};

	// 현위치로 새로고침
	const handleReload = () => {
		window.location.reload();
	};

	const handleClickDistance = e => {
		if (e.target.value === '250m') {
			setLevel(5);
		} else if (e.target.value === '500m') {
			setLevel(6);
		} else if (e.target.value === '1KM') {
			setLevel(7);
		}
	};

	const handleFilter = (option, id) => {
		if (filterList.includes(`${option}=${id}`)) {
			setFilterList(filterList.filter(stack => stack !== `${option}=${id}`).sort());
		} else {
			setFilterList(prev => [...prev, `${option}=${id}`]);
		}
	};

	const [ev, setEv] = useState([]);
	const [cafes, setCafes] = useState([]);

	useEffect(() => {
		fetch(
			`http://172.20.10.7:8000/cafes?SW_latitude=${area.SW?.Ma.toString()}&SW_longitude=${area.SW?.La.toString()}&NE_latitude=${area.NE?.Ma.toString()}&NE_longitude=${area.NE?.La.toString()}`,
		)
			.then(res => res.json())
			.then(data => {
				setCafes(prev => [...prev, ...data.results]);
			});
		fetch(
			`http://172.20.10.7:8000/evs?SW_latitude=${area.SW?.Ma.toString()}&SW_longitude=${area.SW?.La.toString()}&NE_latitude=${area.NE?.Ma.toString()}&NE_longitude=${area.NE?.La.toString()}`,
		)
			.then(res => res.json())
			.then(data => {
				setEv(prev => [...prev, ...data.results]);
			});
	}, [area]);

	console.log('cafe', cafes);
	console.log('ev', ev)

	return (
		<MapWrap>
			<SearchWrap>
				<SearchInput
					placeholder="검색하고자 하는 시,군,구를 입력해주세요"
					onChange={handleSearchAddress}
				></SearchInput>
				<SearchBtn className="searchBtn" type="button" onClick={SearchMap}>
					검색
				</SearchBtn>
			</SearchWrap>
			<MapWrapper>
				<Map // 지도를 표시할 Container
					id={`map`}
					center={state.center}
					style={{
						// 지도의 크기
						width: '400px',
						height: '400px',
					}}
					level={level} // 지도의 확대 레벨
					onTileLoaded={map => {
						setArea({
							SW: map.getBounds().getSouthWest(),
							NE: map.getBounds().getNorthEast(),
						});
					}}
				>
					<MarkerClusterer averageCenter={false} minLevel={7}>
						{selectedCategory === 'coffee' &&
							cafes.map((data, index) => (
								<EventMarkerContainer
									key={index}
									position={{ lat: data.latitude, lng: data.longitude }}
									data={data}
									image={{
										src: markerImageSrc,
										size: imageSize,
										options: {
											spriteSize: spriteSize,
											spriteOrigin: coffeeOrigin,
										},
									}}
								/>
							))}
						{selectedCategory === 'ev' &&
							ev.map((data, index) => (
								<EventMarkerContainer
									key={index}
									position={{ lat: data.latitude, lng: data.longitude }}
									data={data}
									image={{
										src: markerImageSrc,
										size: imageSize,
										options: {
											spriteSize: spriteSize,
											spriteOrigin: evOrigin,
										},
									}}
								/>
							))}
					</MarkerClusterer>
					{!state.isLoading && <MapMarker position={state.center}></MapMarker>}
				</Map>
				{/* 지도 위에 표시될 마커 카테고리 */}

				<div className="category">
					<ul>
						<li id="coffeeMenu" onClick={() => setSelectedCategory('coffee')}>
							<span className="ico_comm ico_coffee"></span>
							카페
						</li>
						<li id="evMenu" onClick={() => setSelectedCategory('ev')}>
							<span className="ico_comm ico_ev"></span>
							충전소
						</li>
					</ul>
				</div>
			</MapWrapper>
			<BtnWrap>
				<DistanceBtnWrap>
					<Btn type="button" onClick={handleReload}>
						현위치
					</Btn>
					<Btn type="button" value="250m" onClick={handleClickDistance}>
						250m
					</Btn>
					<Btn type="button" value="500m" onClick={handleClickDistance}>
						500m
					</Btn>
					<Btn type="button" value="1KM" onClick={handleClickDistance}>
						1KM
					</Btn>
				</DistanceBtnWrap>
				<TypeBtnWrap>
					{meta[0].type.map((data, index) => (
						<Button
							key={index}
							data={data.title}
							isClicked={filterList.includes(`type_ids=${data.id}`)}
							handleClick={() => handleFilter('type_ids', data.id)}
						/>
					))}
				</TypeBtnWrap>
				<BatteryBtnWrap>
					{meta[0].battery.map((data, index) => (
						<Button
							key={index}
							data={data.title}
							isClicked={filterList.includes(`kw_ids=${data.id}`)}
							handleClick={() => handleFilter('kw_ids', data.id)}
						/>
					))}
				</BatteryBtnWrap>
			</BtnWrap>
		</MapWrap>
	);
};

const MapWrap = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const BtnWrap = styled.div`
	display: flex;
	text-align: center;
	width: 400px;
	height: 200px;
`;
const DistanceBtnWrap = styled.div``;
const BatteryBtnWrap = styled.div``;
const TypeBtnWrap = styled.div``;

const Btn = styled.button`
	background-color: #3d8ba8;
	color: white;
	border: none;
`;
const SearchWrap = styled.div``;
const SearchInput = styled.input`
	width: 364px;
	height: 50px;
	padding: 0px;
	outline: none;
	border: none;
`;

const SearchBtn = styled.button`
	background-color: #3d8ba8;
	color: white;
	border: none;
	height: 50px;
	width: 36px;
	padding: 0px;
`;

const MapWrapper = styled.div`
	position: relative;
`;

export default MapBox;
