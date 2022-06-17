import React, { useEffect, useState, useRef } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import EventMarkerContainer from './EventMarkerContainer';
import TypebatteryButton from './Components/Buttons/TypebatteryButton';
import List from './List';
import './MapBox.scss';
import styled from 'styled-components';
import DistanceButton from './Components/Buttons/DistanceButton';
import { API } from '../config';
// import cafeImg from '../../public/images/premium-icon-cafe-3172984.png';
// import cafeIcon from '/public/images/premium-icon-cafe-3172984.png';

const MapBox = () => {
	const { kakao } = window;

	const [state, setState] = useState({
		// 지도의 초기 위치
		center: { lat: 37.5738319, lng: 127.1946859 },
		// { lat: 37.476086, lng: 127.123543 }

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
	const [searchAddress, setSearchAddress] = useState();
	const [metaOutputs, setMetaOutputs] = useState([]);
	const [metaTypes, setMetaTypes] = useState([]);
	const [available, setAvailable] = useState(false);
	const [activeItem, setActiveItem] = useState({});
	const map = useRef();

	// const handleReload = () => {
	// 	if (!navigator.geolocation) {
	// 		// GeoLocation을 이용해서 접속 위치를 얻어옵니다
	// 		navigator.geolocation.getCurrentPosition(
	// 			position => {
	// 				setState(prev => ({
	// 					...prev,
	// 					center: {
	// 						lat: position.coords.latitude, // 위도
	// 						lng: position.coords.longitude, // 경도
	// 					},
	// 					isLoading: false,
	// 				}));

	// 				// map.current.panTo(
	// 				// 	new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
	// 				// );
	// 			},
	// 			err => {
	// 				setState(prev => ({
	// 					...prev,
	// 					errMsg: err.message,
	// 					isLoading: false,
	// 				}));
	// 			},
	// 		);
	// 	} else {
	// 		fetch('https://geolocation-db.com/json/')
	// 			.then(res => res.json())
	// 			.then(data => {
	// 				const { latitude, longitude } = data;
	// 				setState(prev => ({
	// 					...prev,
	// 					center: {
	// 						lat: latitude, // 위도
	// 						lng: longitude, // 경도
	// 					},
	// 					isLoading: false,
	// 				}));
	// 			})
	// 			.catch(e => {
	// 				console.log(e, 'ddd');
	// 				setState(prev => ({
	// 					...prev,
	// 					errMsg: 'geolocation을 사용할수 없어요..',
	// 					isLoading: false,
	// 				}));
	// 			});
	// 		// HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
	// 	}
	// };

	// const [test, setTest] = useState(false);

	// useEffect(() => {
	// 	if (navigator.geolocation) {
	// 		// GeoLocation을 이용해서 접속 위치를 얻어옵니다
	// 		navigator.geolocation.getCurrentPosition(
	// 			position => {
	// 				setState(prev => ({
	// 					...prev,
	// 					center: {
	// 						lat: position.coords.latitude, // 위도
	// 						lng: position.coords.longitude, // 경도
	// 					},
	// 					isLoading: false,
	// 				}));
	// 			},
	// 			err => {
	// 				setState(prev => ({
	// 					...prev,
	// 					errMsg: err.message,
	// 					isLoading: false,
	// 				}));
	// 			},
	// 		);
	// 	} else {
	// 		// HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
	// 		setState(prev => ({
	// 			...prev,
	// 			errMsg: 'geolocation을 사용할수 없어요..',
	// 			isLoading: false,
	// 		}));
	// 	}
	// }, []);

	// console.log(state);
	// console.log(area);

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

	// 검색기능
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

	// const handleTest = () => {
	// 	setTest(true);
	// };

	// 버튼 클릭시 반경 조정
	const handleClickDistance = e => {
		if (e.target.value === '250m') {
			setLevel(5);
		} else if (e.target.value === '500m') {
			setLevel(6);
		} else setLevel(7);
	};

	// 배터리용량 필터링
	const handleBatteryFilter = (option, query) => {
		if (filterBatteryQuery.includes(`${option}=${query}`)) {
			setFilterBatteryQuery(filterBatteryQuery.filter(value => value !== `${option}=${query}`));
		} else {
			setFilterBatteryQuery(prev => [...prev, `${option}=${query}`]);
		}
	};

	// 충전기 타입 필터링
	const handleTypeFilter = num => {
		if (filterTypeQuery.includes(`${num}`)) {
			setFilterTypeQuery(filterTypeQuery.filter(value => value !== `${num}`));
		} else {
			setFilterTypeQuery(prev => [...prev, `${num}`]);
		}
	};

	// 충전소 , 카페 지도에 뿌려주는 fetch

	useEffect(() => {
		if (area === null) {
			return;
		}
		// } else if (state.center.lat === null) {
		// 	return;
		// }

		const types = [...new Set([...filterTypeQuery.join(',').split(',')])].sort().join('').slice();

		// if (selectedCategory === 'coffee') {
		// 	return;
		// }

		fetch(
			`${API.CAFE}${new URLSearchParams({
				...area,
			})}`,
		)
			.then(res => res.json())
			.then(data => {
				setCafes(data.results);
			});
		fetch(
			`${API.EV}?${filterBatteryQuery.join('&')}&${new URLSearchParams({
				...area,
				charger_type_ids: types,
				usable: available ? 'YES' : 'NO',
			})}`,
		)
			.then(res => res.json())
			.then(data => {
				setEv(data.results);
			});
	}, [area, filterTypeQuery, filterBatteryQuery, selectedCategory, available]);

	// 가까운 카페 및 충전소 받아오는 fetch

	useEffect(() => {
		if (state.center.lat === null) {
			return;
		}

		fetch(
			`${API.CAFE}/nearest?&user_longitude=${state.center.lng}&user_latitude=${state.center.lat}`,
		)
			.then(res => res.json())
			.then(data => {
				setCafeNearest([data.results]);
			});
		fetch(`${API.EV}nearest?user_longitude=${state.center.lng}&user_latitude=${state.center.lat}`)
			.then(res => res.json())
			.then(data => {
				setEvNearest([data.results]);
			});
	}, [state]);

	useEffect(() => {
		fetch(`${API.COMMONS}`)
			.then(response => response.json())
			.then(data => {
				setMetaTypes(data.results.charger.filtering_include_search);
			});
		fetch(`${API.COMMONS}`)
			.then(response => response.json())
			.then(data => {
				setMetaOutputs(data.results.charger.outputs.output);
			});
	}, []);
	/////////////////////////////////

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
					ref={map}
					center={state.center}
					style={{
						// 지도의 크기
						width: '350px',
						height: '370px',
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
					maxLevel={8}
				>
					<MarkerClusterer minClusterSize={3} averageCenter={false} minLevel={8}>
						{selectedCategory === 'coffee' &&
							cafes.map((data, index) => (
								<EventMarkerContainer
									onClick={data => setActiveItem(data)}
									activeItem={activeItem}
									key={data.name}
									position={{ lat: data.latitude, lng: data.longitude }}
									data={data}
									image={{
										src: `${process.env.PUBLIC_URL}/images/premium-icon-cafe-3172984.png`,
										size: {
											width: 15,
											height: 20,
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
									onClick={data => setActiveItem(data)}
									activeItem={activeItem}
									key={data.id}
									position={{ lat: data.latitude, lng: data.longitude }}
									data={data}
									image={{
										src: `${
											data.chargers[0].usable_by_filtering === 'YES'
												? `${process.env.PUBLIC_URL}/images/premium-icon-charging-station-4426682.png`
												: `${process.env.PUBLIC_URL}/images/premium-icon-charging-station-4426752.png`
										}`,
										size: {
											width: 15,
											height: 20,
										}, // 마커이미지의 크기입니다.
										options: {
											offset: {
												x: 6,
												y: 73,
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
								<CategoryImg
									src={`${process.env.PUBLIC_URL}/images/premium-icon-cafe-3172984.png`}
								/>
							</IconWrap>
						</li>
						<li id="evMenu" onClick={() => setSelectedCategory('ev')}>
							충전소
							<IconWrap>
								<CategoryImg
									src={`${process.env.PUBLIC_URL}/images/premium-icon-charging-station-4426682.png`}
								/>
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
					<TypebatteryButton
						data={available ? '전체 충전소 보기' : '사용가능한 충전기 보기'}
						isClicked={available}
						handleClick={() => setAvailable(prev => !prev)}
					/>
				</DistanceBtnWrap>
				{selectedCategory === 'ev' ? (
					<>
						<TypeBtnWrap>
							{metaTypes.map((data, index) => (
								<TypebatteryButton
									key={index}
									data={data.title}
									isClicked={filterTypeQuery.includes(`${data.nums}`)}
									handleClick={() => handleTypeFilter(data.nums)}
								/>
							))}
						</TypeBtnWrap>
						<BatteryBtnWrap>
							{metaOutputs.map((data, index) => (
								<TypebatteryButton
									key={index}
									data={data.capacity}
									isClicked={filterBatteryQuery.includes(`outputs=${data.query}`)}
									handleClick={() => handleBatteryFilter('outputs', data.query)}
								/>
							))}
						</BatteryBtnWrap>
					</>
				) : (
					<div />
				)}
			</BtnWrap>

			<>
				{selectedCategory === 'ev' &&
					cafeNearest.map((data, index) => (
						<List selectedCategory={selectedCategory} key={index} data={data} />
					))}
				{selectedCategory === 'ev' && (
					<>
						<div style={{ fontWeight: '700', marginTop: '10px' }}>
							보고계신 지역에는 {cafes.length}개의 카페가 있습니다.
						</div>
						<LookingListWrap>
							{cafes.map((data, index) => (
								<LookingList key={index}>
									<a
										href={`https://map.kakao.com/link/to/${data.name},${data.latitude},${data.longitude}`}
										target="_blank"
										rel="noreferrer"
										style={{ textDecoration: 'none', color: 'black' }}
									>
										{data.name}
									</a>
								</LookingList>
							))}
						</LookingListWrap>
					</>
				)}

				{selectedCategory === 'coffee' &&
					evNearest.map((data, index) => (
						<List state={state} selectedCategory={selectedCategory} key={index} data={data} />
					))}
				{selectedCategory === 'coffee' && (
					<>
						{/* {(filterBatteryQuery, filterTypeQuery)} */}
						<div style={{ fontWeight: '700', marginTop: '10px', marginBottom: '5px' }}>
							보고계신 지역에는 {ev.length}개의 충전소가 있습니다.
						</div>

						<LookingListWrap>
							{ev.map(data => (
								<LookingList key={data.id}>
									<a
										href={`https://map.kakao.com/link/to/${data.name},${data.latitude},${data.longitude}`}
										target="_blank"
										rel="noreferrer"
										style={{ textDecoration: 'none', color: 'black' }}
									>
										{data.name}
									</a>
								</LookingList>
							))}
						</LookingListWrap>
					</>
				)}
			</>
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
	margin-top: 5px;
`;
const BatteryBtnWrap = styled.div`
	margin-top: 5px;
`;
const TypeBtnWrap = styled.div`
	margin-top: 5px;
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
	height: 40px;
	padding: 0px;
	outline: none;
	border: none;
`;

const SearchBtn = styled.button`
	background-color: #14c9f2;
	color: white;
	border: none;
	height: 40px;
	width: 30px;
	padding: 0px;
`;

const MapWrapper = styled.div`
	position: relative;
`;

// const ListWrap = styled.ul`
// 	border: 1px solid rgba(0, 0, 0, 0.4);
// 	border-color: #14c9f2;
// 	border-radius: 10px;
// 	display: flex;
// 	flex-direction: column;
// 	align-items: center;
// 	padding: 0;
// 	overflow-y: scroll;
// 	max-height: 100px;
// 	margin-top: 7px;
// 	width: 350px;
// `;

const LookingListWrap = styled.ul`
	magin-top: 5px;
	display: flex;
	flex-direction: column;
	padding: 0;
	max-height: 300px;
	overflow-y: scroll;
`;
const LookingList = styled.li`
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 10px;
	height: 35px;
	width: 270px;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	list-style: none;

	margin-top: 7px;
`;

const IconWrap = styled.span``;

const CategoryImg = styled.img`
	width: 30px;
	height: 30px;
`;

export default MapBox;
