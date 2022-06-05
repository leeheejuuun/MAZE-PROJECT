import React, { useState } from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';

export default function EventMarkerContainer({ data, position, image }) {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<MapMarker position={position} onClick={() => setIsVisible(prev => !prev)} image={image}>
			{isVisible && (
				<div className="wrap">
					<div className="info">
						<div className="title">{data.name}</div>
						<div className="body">
							<div className="desc">
								<div className="ellipsis">{data.road_name_address}</div>
								<div className="jibun ellipsis">{data.useTime}</div>
							</div>
						</div>
						<div className="close" onClick={() => setIsVisible(prev => !prev)}></div>
					</div>
				</div>
			)}
		</MapMarker>
	);
}
