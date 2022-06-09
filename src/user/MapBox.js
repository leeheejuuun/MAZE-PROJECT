import React, { useEffect, useState } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import EventMarkerContainer from './EventMarkerContainer';
import TypebatteryButton from './Components/Buttons/TypebatteryButton';
import List from './List';
import './MapBox.scss';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faChargingStation } from '@fortawesome/free-solid-svg-icons';
import DistanceButton from './Components/Buttons/DistanceButton';
import evImg from '../images/6395411-removebg-preview.png';
const meta = {
	type: [
		{ id: 1, title: 'DC차데모', num: '1,3,5,6' },
		{ id: 2, title: 'AC완속', num: '2' },
		{ id: 3, title: 'AC3상', num: '3,6,7' },
		{ id: 4, title: 'DC콤보', num: '4,5,6' },
	],
	battery: [
		{ id: 3, title: '3kw' },
		{ id: 7, title: '7kw' },
		{ id: 14, title: '14kw' },
		{ id: 40, title: '40kw' },
		{ id: 50, title: '50kw' },
		{ id: 100, title: '100kw' },
		{ id: 175, title: '175kw' },
		{ id: 200, title: '200kw' },
		{ id: 260, title: '260kw' },
		{ id: 350, title: '350kw' },
	],
};

const MapBox = () => {
	const { kakao } = window;
	// const markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png';
	// const imageSize = { width: 22, height: 26 };
	// const spriteSize = { width: 36, height: 98 };
	// const coffeeOrigin = { x: 10, y: 0 };
	// const evOrigin = { x: 10, y: 36 };

	const [state, setState] = useState({
		// 지도의 초기 위치
		center: { lat: null, lng: null },

		// 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
		isPanto: true,
		errMsg: null,
		isLoading: false,
	});

	// 다중필터링 담는 state
	const [filterTypeQuery, setFilterTypeQuery] = useState([]);
	const [filterBatteryQuery, setFilterBatteryQuery] = useState([]);

	const [selectedCategory, setSelectedCategory] = useState('ev');
	const [level, setLevel] = useState(4);
	const [area, setArea] = useState(null);
	const [ev, setEv] = useState([]);
	const [cafes, setCafes] = useState([]);
	const [evNearest, setEvNearest] = useState([]);
	const [cafeNearest, setCafeNearest] = useState([]);

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
		const placesSearch = function (data, status) {
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
		} else if (e.target.value === '1km') {
			setLevel(7);
		}
	};

	const handleFilter = (option, id) => {
		if (filterBatteryQuery.includes(`${option}=${id}`)) {
			setFilterBatteryQuery(filterBatteryQuery.filter(value => value !== `${option}=${id}`));
		} else {
			setFilterBatteryQuery(prev => [...prev, `${option}=${id}`]);
		}
	};

	const handleTypeFilter = num => {
		if (filterTypeQuery.includes(`${num}`)) {
			setFilterTypeQuery(filterTypeQuery.filter(value => value !== `${num}`));
		} else {
			setFilterTypeQuery(prev => [...prev, `${num}`]);
		}
	};

	useEffect(() => {
		if (area === null) {
			return;
		}

		const types = [...new Set([...filterTypeQuery.join(',').split(',')])].sort().join('').slice();

		// if (selectedCategory === 'coffee') {

		// 	return;
		// }

		fetch(
			`http://54.180.104.23:8000/cafes?${new URLSearchParams({
				...area,
			})}`,
		)
			.then(res => res.json())
			.then(data => {
				// setCafes(prev => [...prev, ...data.results]);
				setCafes(data.results);
				console.log('cafes', data);
			});
		fetch(
			`http://54.180.104.23:8000/evs?${filterBatteryQuery.join('&')}&${new URLSearchParams({
				...area,
				charger_type_ids: types,
			})}`,
		)
			.then(res => res.json())
			.then(data => {
				setEv(data.results);
				console.log('ev', data);
			});
	}, [area, filterTypeQuery, filterBatteryQuery, selectedCategory]);

	useEffect(() => {
		if (state.center.lat === null) {
			return;
		}

		fetch(
			`http://54.180.104.23:8000/cafes/nearest?&user_longitude=${state.center.lng}&user_latitude=${state.center.lat}`,
		)
			.then(res => res.json())
			.then(data => {
				setCafeNearest([data.results]);
			});
		fetch(
			`http://54.180.104.23:8000/evs/nearest?user_longitude=${state.center.lng}&user_latitude=${state.center.lat}`,
		)
			.then(res => res.json())
			.then(data => {
				setEvNearest([data.results]);
				// console.log(data);
			});
	}, [state]);

	return (
		<MapWrap>
			<SearchWrap>
				<SearchInput
					placeholder="검색하고자 하는 시,군,구를 입력해주세요"
					onChange={handleSearchAddress}
				/>
				<SearchBtn className="searchBtn" type="button" onClick={SearchMap}>
					검색
				</SearchBtn>
			</SearchWrap>
			<MapWrapper>
				<Map // 지도를 표시할 Container
					id="map"
					center={state.center}
					style={{
						// 지도의 크기
						width: '350px',
						height: '400px',
					}}
					level={level} // 지도의 확대 레벨
					onTileLoaded={map => {
						setArea({
							SW_latitude: map.getBounds().getSouthWest().Ma.toString(),
							SW_longitude: map.getBounds().getSouthWest().La.toString(),
							NE_latitude: map.getBounds().getNorthEast().Ma.toString(),
							NE_longitude: map.getBounds().getNorthEast().La.toString(),
						});
					}}
				>
					<MarkerClusterer averageCenter={false} minLevel={7}>
						{selectedCategory === 'coffee' &&
							cafes.map(data => (
								<EventMarkerContainer
									key={data.name}
									position={{ lat: data.latitude, lng: data.longitude }}
									data={data}
									image={{
										// src: 'https://littledeep.com/wp-content/uploads/2019/04/littledeep_illustration_coffee_png1.png', // 마커이미지의 주소입니다

										src: 'https://cdn-icons.flaticon.com/png/512/3172/premium/3172984.png?token=exp=1654744361~hmac=b266b2748dc4c587f5dc402ad95eb993',
										size: {
											width: 25,
											height: 30,
										}, // 마커이미지의 크기입니다
										options: {
											offset: {
												x: 27,
												y: 69,
											}, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
										},
									}}
									selectedCategory={selectedCategory}
								/>
							))}
						{selectedCategory === 'ev' &&
							ev.map(data => (
								<EventMarkerContainer
									key={data.id}
									position={{ lat: data.latitude, lng: data.longitude }}
									data={data}
									image={{
										src: 'https://cdn-icons-png.flaticon.com/512/4666/4666986.png',
										size: {
											width: 25,
											height: 30,
										}, // 마커이미지의 크기입니다
										options: {
											offset: {
												x: 27,
												y: 69,
											}, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
										},
									}}
									selectedCategory={selectedCategory}
								/>
							))}
					</MarkerClusterer>

					{!state.isLoading && <MapMarker position={state.center} />}
				</Map>
				{/* 지도 위에 표시될 마커 카테고리 */}

				<div className="category">
					<ul>
						<li id="coffeeMenu" onClick={() => setSelectedCategory('coffee')}>
							카페
							<IconWrap>
								<CategoryImg src="https://cdn-icons.flaticon.com/png/512/3172/premium/3172984.png?token=exp=1654744361~hmac=b266b2748dc4c587f5dc402ad95eb993"></CategoryImg>
								{/* <FontAwesomeIcon size="xl" className="coffeeIcon" icon={faCoffee} /> */}
							</IconWrap>
						</li>
						<li id="evMenu" onClick={() => setSelectedCategory('ev')}>
							충전소
							<IconWrap>
								{/* <FontAwesomeIcon
									className="chargingStationIcon"
									size="xl"
									icon={faChargingStation}
								/> */}
								<CategoryImg src="https://cdn-icons-png.flaticon.com/512/4666/4666986.png"></CategoryImg>
							</IconWrap>
						</li>
					</ul>
				</div>
			</MapWrapper>
			<BtnWrap>
				<DistanceBtnWrap>
					<Btn type="button" onClick={handleReload}>
						현위치
					</Btn>
					<DistanceButton handleClickDistance={handleClickDistance} />
				</DistanceBtnWrap>
				{selectedCategory === 'ev' ? (
					<>
						<TypeBtnWrap>
							{meta.type.map((data, index) => (
								<TypebatteryButton
									key={index}
									data={data.title}
									isClicked={filterTypeQuery.includes(`${data.num}`)}
									handleClick={() => handleTypeFilter(data.num)}
								/>
							))}
						</TypeBtnWrap>
						<BatteryBtnWrap>
							{meta.battery.map((data, index) => (
								<TypebatteryButton
									key={index}
									data={data.title}
									isClicked={filterBatteryQuery.includes(`outputs=${data.id}`)}
									handleClick={() => handleFilter('outputs', data.id)}
								/>
							))}
						</BatteryBtnWrap>
					</>
				) : (
					<div />
				)}
			</BtnWrap>
			<ListWrap>
				{selectedCategory === 'ev' &&
					cafeNearest.map((data, index) => (
						<List selectedCategory={selectedCategory} key={index} data={data} />
					))}
				{selectedCategory === 'ev' && (
					<>
						<div>보고계신 지역에는 {cafes.length}개의 카페가 있습니다.</div>
						<ul>
							{cafes.map((data, index) => (
								<li key={index}>{data.name}</li>
							))}
						</ul>
					</>
				)}
				{selectedCategory === 'coffee' &&
					evNearest.map((data, index) => (
						<List selectedCategory={selectedCategory} key={index} data={data} />
					))}
				{selectedCategory === 'coffee' && (
					<>
						{(filterBatteryQuery, filterTypeQuery)}
						<div>보고계신 지역에는 {ev.length}개의 충전소가 있습니다.</div>
						<ul>
							{ev.map(data => (
								<li key={data.id}>{data.name}</li>
							))}
						</ul>
					</>
				)}
			</ListWrap>
		</MapWrap>
	);
};

const MapWrap = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const BtnWrap = styled.div`
	width: 350px;
`;
const DistanceBtnWrap = styled.div`
	/* margin-top: 10px; */
`;
const BatteryBtnWrap = styled.div`
	/* margin-top: 10px; */
`;
const TypeBtnWrap = styled.div`
	/* margin-top: 10px; */
`;

const Btn = styled.button`
	border-radius: 10px;
	background-color: #14c9f2;
	height: 22px;
	color: white;
	border: none;
	margin-right: 5px;
`;
const SearchWrap = styled.div``;
const SearchInput = styled.input`
	width: 320px;
	height: 50px;
	padding: 0px;
	outline: none;
	border: none;
`;

const SearchBtn = styled.button`
	background-color: #14c9f2;
	color: white;
	border: none;
	height: 50px;
	width: 30px;
	padding: 0px;
`;

const MapWrapper = styled.div`
	position: relative;
`;

const ListWrap = styled.ul`
	border: 1px solid rgba(0, 0, 0, 0.4);
	border-color: #14c9f2;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0;
	overflow-y: scroll;
	max-height: 100px;
`;

const IconWrap = styled.span`
	/* margin-top: 5px;
	margin-bottom: 10px; */
`;

const CategoryImg = styled.img`
	width: 30px;
	height: 30px;
`;

export default MapBox;
