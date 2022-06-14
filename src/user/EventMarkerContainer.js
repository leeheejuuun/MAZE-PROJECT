import React, { useState } from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';
import styled from 'styled-components';

export default function EventMarkerContainer({ data, position, image, selectedCategory }) {
	const [isVisible, setIsVisible] = useState(false);

	const handleOpen = () => {
		setIsVisible(prev => !prev);
	};

	return (
		<MapMarker
			position={position}
			onClick={handleOpen}
			image={image}
			infoWindowOptions={{
				zIndex: 9999,
			}}
		>
			{isVisible && (
				<div>
					{selectedCategory === 'ev' ? (
						<div className="wrap">
							<div className="info">
								<div className="title">{data.name}</div>
								<div className="body">
									<MetaWrap>
										<MetaTitle>
											{' '}
											주소 : <MetaContent>{data.road_name_address}</MetaContent>
											<Directions
												href={`https://map.kakao.com/link/to/${data.name},${data.latitude},${data.longitude}`}
												target="_blank"
												rel="noreferrer"
											>
												길찾기
											</Directions>
										</MetaTitle>

										<MetaTitle>
											주차 가능여부 Y / N : <MetaContent>{data.parking_free_yes_or_no}</MetaContent>
										</MetaTitle>
										<MetaTitle>
											출입 정보 :{' '}
											<MetaContent>
												{data.limit_detail === '' ? '정보 없음' : data.limit_detail}
											</MetaContent>
										</MetaTitle>
										<MetaTitle>
											업체명 : <MetaContent>{data.business_name}</MetaContent>
										</MetaTitle>
										<MetaTitle>
											충전기 대수 :{' '}
											<MetaContent>
												{data.chargers.chargers_in_station.length} 대{' '}
												{(data.chargers.quick_and_slow.of_total_charger.quick !== 0 ||
													data.chargers.quick_and_slow.of_total_charger.slow !== 0) && (
													<>
														(급속 : {data.chargers.quick_and_slow.of_total_charger.quick}대 , 완속 :{' '}
														{data.chargers.quick_and_slow.of_total_charger.slow}대)
													</>
												)}
											</MetaContent>
										</MetaTitle>
									</MetaWrap>
									<ChargerWrap>
										{data.chargers.chargers_in_station.map((data, index) => (
											<MetaList key={index}>
												<MetaListTitle>
													{data.charger_type} :{' '}
													<StatusWrap
														unidentified={data.charging_status === '상태미확인'}
														charging={data.charging_status === '충전 중'}
														stop={data.charging_status === '운영중지'}
														inspection={data.charging_status === '점검 중'}
														error={data.charging_status === '통신이상'}
													>
														{data.charging_status}
													</StatusWrap>
												</MetaListTitle>
											</MetaList>
										))}
									</ChargerWrap>
								</div>
								<div className="close" onClick={() => setIsVisible(prev => !prev)} />
							</div>
						</div>
					) : (
						<div className="wrap">
							<div className="info">
								<div className="title">{data.name}</div>
								<div className="body">
									<MetaWrap>
										<MetaTitle>
											주소 : <MetaContent>{data.land_lot_number_address}</MetaContent>
											<Directions
												href={`https://map.kakao.com/link/to/${data.name},${data.latitude},${data.longitude}`}
												target="_blank"
												rel="noreferrer"
											>
												길찾기
											</Directions>
										</MetaTitle>
									</MetaWrap>
								</div>
								<div className="close" onClick={() => setIsVisible(prev => !prev)} />
							</div>
						</div>
					)}
				</div>
			)}
		</MapMarker>
	);
}

const MetaWrap = styled.div`
	margin-top: 10px;
	z-index: 9999;
	/* margin-bottom: 10px; */
`;
const ChargerWrap = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	margin-bottom: 10px;
`;

const MetaTitle = styled.div`
	font-size: 15px;
	font-weight: 600;
	margin-bottom: 5px;
`;

const MetaContent = styled.span`
	font-size: 13px;
	font-weight: 400;
`;

const StatusWrap = styled.span`
	font-size: 13px;
	font-weight: 400;
	color: ${props =>
		props.unidentified || props.stop || props.inspection || props.charging || props.error
			? 'red'
			: 'blue'};
`;

const MetaList = styled.li``;

const MetaListTitle = styled.span`
	font-size: 15px;
	font-weight: 600;
`;
const Directions = styled.a`
	color: blue;
	outline: none;
	margin-left: 4px;
	font-size: 5px;
`;
