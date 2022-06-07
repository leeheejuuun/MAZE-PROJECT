import React, { useState } from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';
import styled from 'styled-components';

export default function EventMarkerContainer({ data, position, image, selectedCategory }) {
	const [isVisible, setIsVisible] = useState(false);

	console.log(data);

	return (
		<MapMarker position={position} onClick={() => setIsVisible(prev => !prev)} image={image}>
			{isVisible && (
				<div>
					{selectedCategory === 'ev' ? (
						<div className="wrap">
							<div className="info">
								<div className="title">{data.name}</div>
								<div className="body">
									<MetaWrap>
										<div className="ellipsis">주소 : {data.road_name_address}</div>
										<div className="jibun ellipsis">{data.useTime}</div>
										<div>주차 가능여부 Y / N : {data.parking_free_yes_or_no}</div>
										<div>업체명 : {data.business_name}</div>
										<div>충전기 대수 : {data.chargers.count_of_status.total_charger} 대</div>
										<ChargerWrap>
											{data.chargers.chargers_in_station.map((data, index) => (
												<li key={index}>
													{data.charger_type} : {data.charging_status}
												</li>
											))}
										</ChargerWrap>
									</MetaWrap>
								</div>
								<div className="close" onClick={() => setIsVisible(prev => !prev)}></div>
							</div>
						</div>
					) : (
						<div className="wrap">
							<div className="info">
								<div className="title">{data.name}</div>
								<div className="body">
									<MetaWrap>
										<div className="ellipsis">주소 : {data.road_name_address}</div>
									</MetaWrap>
								</div>
								<div className="close" onClick={() => setIsVisible(prev => !prev)}></div>
							</div>
						</div>
					)}
				</div>
			)}
		</MapMarker>
	);
}

const MetaWrap = styled.div`
	margin-top: 20px;
	margin-bottom: 20px;
`;
const ChargerWrap = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* margin-top: 20px; */
	margin-bottom: 20px;
`;
