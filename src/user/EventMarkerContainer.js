import React, { useState } from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';
import styled from 'styled-components';

export default function EventMarkerContainer({ data, position, image, selectedCategory }) {
	const [isVisible, setIsVisible] = useState(false);

	const handleOpen = () => {
		setIsVisible(prev => !prev);
	};
	return (
		<MapMarker position={position} onClick={handleOpen} image={image}>
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
										</MetaTitle>
										<MetaTitle>
											주차 가능여부 Y / N : <MetaContent>{data.parking_free_yes_or_no}</MetaContent>
										</MetaTitle>
										<MetaTitle>
											출입 정보 :{' '}
											<MetaContent>
												{data.limit_detail === '' ? '시설정보 없음' : data.limit_detail}
											</MetaContent>
										</MetaTitle>
										<MetaTitle>
											업체명 : <MetaContent>{data.business_name}</MetaContent>
										</MetaTitle>
										<MetaTitle>
											충전기 대수 :{' '}
											<MetaContent>{data.chargers.count_of_status.total_charger} 대</MetaContent>
										</MetaTitle>
									</MetaWrap>
									<ChargerWrap>
										{data.chargers.chargers_in_station.map((data, index) => (
											<MetaList key={index}>
												<MetaListTitle>
													{data.charger_type} :{' '}
													<MetaContent>
														{data.charging_status === '' ? '상태 미확인' : data.charging_status}
													</MetaContent>
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
	margin-bottom: 10px;
`;
const ChargerWrap = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	/* margin-top: 20px; */
	margin-bottom: 20px;
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

const MetaList = styled.li``;

const MetaListTitle = styled.span`
	font-size: 15px;
	font-weight: 600;
`;
