import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Grid, List, ListItem, ListItemText, Badge } from '@material-ui/core'

import Axios from 'axios'

import { daysToYears } from '../date/date'

import config from '../config.json'

interface IVideo {
	id: number
	name: string
	ageInVideo: number
}

const VideosPage = () => {
	const [videos, setVideos] = useState([])

	useEffect(() => {
		Axios.get(`${config.api}/video`).then(({ data }) => setVideos(data))
	}, [])

	return (
		<Grid item id='videos-page'>
			<List>
				{videos.map((video: IVideo) => (
					<ListItem button divider key={video.id}>
						<Badge
							color='primary'
							badgeContent={daysToYears(video.ageInVideo)}
							style={{ marginRight: '2em' }}
						/>

						<Link to={`/video/${video.id}`}>
							<ListItemText>{video.name}</ListItemText>
						</Link>
					</ListItem>
				))}
			</List>
		</Grid>
	)
}

export default VideosPage
