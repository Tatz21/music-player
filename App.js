import React from 'react'
import { StyleSheet,Dimensions, TouchableOpacity,SafeAreaView, View, Image, Text } from 'react-native'
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider';
import ProgressCircle from 'react-native-progress-circle';

const Dev_Height = Dimensions.get("window").height
const Dev_Width = Dimensions.get("window").width


import {AntDesign,Entypo,Feather,Ionicons} from "react-native-vector-icons"


const audioBookPlaylist = [
	{
		title: 'Hamlet - Act I',
		author: 'William Shakespeare',
		source: 'Librivox',
		uri:
			'https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act1_shakespeare.mp3',
		imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
	},
	{
		title: 'Hamlet - Act II',
		author: 'William Shakespeare',
		source: 'Librivox',
		uri:
			'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act2_shakespeare.mp3',
		imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
	},
	{
		title: 'Hamlet - Act III',
		author: 'William Shakespeare',
		source: 'Librivox',
		uri: 'http://www.archive.org/download/hamlet_0911_librivox/hamlet_act3_shakespeare.mp3',
		imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
	},
	{
		title: 'Hamlet - Act IV',
		author: 'William Shakespeare',
		source: 'Librivox',
		uri:
			'https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act4_shakespeare.mp3',
		imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
	},
	{
		title: 'Hamlet - Act V',
		author: 'William Shakespeare',
		source: 'Librivox',
		uri:
			'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act5_shakespeare.mp3',
		imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
	}
]

export default class App extends React.Component {
	state = {
		isPlaying: false,
		playbackInstance: null,
		currentIndex: 0,
		volume: 1.0,
		isBuffering: true
	}

	async componentDidMount() {
		try {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
				playsInSilentModeIOS: true,
				interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
				shouldDuckAndroid: true,
				staysActiveInBackground: true,
				playThroughEarpieceAndroid: true
			})

			this.loadAudio()
		} catch (e) {
			console.log(e)
		}
	}

	async loadAudio() {
		const { currentIndex, isPlaying, volume } = this.state

		try {
			const playbackInstance = new Audio.Sound()
			const source = {
				uri: audioBookPlaylist[currentIndex].uri
			}

			const status = {
				shouldPlay: isPlaying,
				volume: volume
			}

			playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
			await playbackInstance.loadAsync(source, status, false)
			this.setState({
				playbackInstance
			})
		} catch (e) {
			console.log(e)
		}
	}

	onPlaybackStatusUpdate = status => {
		this.setState({
			isBuffering: status.isBuffering
		})
	}

	handlePlayPause = async () => {
		const { isPlaying, playbackInstance } = this.state
		isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

		this.setState({
			isPlaying: !isPlaying
		})
	}

	handlePreviousTrack = async () => {
		let { playbackInstance, currentIndex } = this.state
		if (playbackInstance) {
			await playbackInstance.unloadAsync()
			currentIndex < audioBookPlaylist.length - 1 ? (currentIndex -= 1) : (currentIndex = 0)
			this.setState({
				currentIndex
			})
			this.loadAudio()
		}
	}

	handleNextTrack = async () => {
		let { playbackInstance, currentIndex } = this.state
		if (playbackInstance) {
			await playbackInstance.unloadAsync()
			currentIndex < audioBookPlaylist.length - 1 ? (currentIndex += 1) : (currentIndex = 0)
			this.setState({
				currentIndex
			})
			this.loadAudio()
		}
	}

	renderFileInfo() {
		const { playbackInstance, currentIndex } = this.state
		return playbackInstance ? (
			<View style={styles.trackInfo}>
				<Text style={[styles.trackInfoText, styles.largeText]}>
					{audioBookPlaylist[currentIndex].title}
				</Text>
				<Text style={[styles.trackInfoText, styles.smallText]}>
					{audioBookPlaylist[currentIndex].author}
				</Text>
				<Text style={[styles.trackInfoText, styles.smallText]}>
					{audioBookPlaylist[currentIndex].source}
				</Text>
			</View>
		) : null
	}

	render() {
		return (
      <SafeAreaView style={styles.topview}>
        <View style={styles.mainbar}>
          <AntDesign name="left" size={24} style={{marginLeft:"5%"}} />
          <Text style={styles.now_playing_text}> Now Playing </Text>
          <Entypo name="dots-three-horizontal" size={24} style={{marginLeft:"20%"}} />
        </View>
			<View style={styles.container}>
				<Image
					style={styles.albumCover}
					source={{ uri: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg' }}
				/>
       
       <View style={styles.name_of_song_View} >
          <Text style={styles.name_of_song_Text1}>#02 - Hamlet</Text>
          <Text style={styles.name_of_song_Text2}>Part -2</Text>
        </View>

        <View style={styles.slider_view}>
          <Text style={styles.slider_time}> 2:10 </Text>
            <Slider
                  style={styles.slider_style}
                  minimumValue={0}
                  maximumValue={12.02}
                  minimumTrackTintColor="#e75480"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#e75480"
                  value={1.0}
                />
          <Text style={styles.slider_time}>12:02</Text>
        </View>



				<View style={styles.controls}>
        <Entypo name="shuffle" size={24} color="#e75480" style={{marginLeft:"9%"}}/>
        
					<TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
          <Entypo name="controller-fast-backward" size={24} color="#e75480" style={{marginLeft:"12%"}}/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
						{this.state.isPlaying ? (
						 <Ionicons name='ios-pause' size={48} color='#444' />
						) : (
							<AntDesign name="pausecircle" size={50} color="#e75480" style={{marginLeft:"1%"}}/>
						)}
					</TouchableOpacity>
					<TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
					<Entypo name="controller-fast-forward" size={24} color="#e75480" style={{marginLeft:"12%"}}/>
          
					</TouchableOpacity>
          <Feather name="repeat" size={20} color="#e75480" style={{marginLeft:"0.4%"}}/>
          </View>
          <View style={styles.recently_played_view}>
          <Text style={styles.recently_played_text}> Recently Played </Text>
          <View style={styles.recently_played_list}>
            <Image source={{uri: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg' }} style={styles.recently_played_image} />
             <View style={styles.recently_played_list_text}>
                <Text style={styles.recently_played_list_text1}> #01 - Hamlet</Text>
                <Text style={styles.recently_played_list_text2}> By  William Shakespeare - 15: 35 </Text>
             </View>
             <View>
                <ProgressCircle
                percent={40}
                radius={25}
                borderWidth={5}
                color="#e75480"
                shadowColor="#FFF"
                bgColor="#fff">
                     <AntDesign name="play" size={37} color="#e75480" style={{marginTop:"4%"}}/>
                </ProgressCircle>
          </View>
        </View>
      </View>

				{this.renderFileInfo()}
			</View>
      </SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
  },
  mainbar:{
    height:"10%",
    width:"100%",
    flexDirection:"row",
    alignItems:"center",
  },
  topview:{
    height:Dev_Height,
    width:Dev_Width,
  },
	albumCover: {
		height:"30%",
    width:"50%",
    justifyContent:"center",
    alignItems:"center",
  },
  slider_view:{
    height:"10%",
    width:"100%",
    alignItems:"center",
    flexDirection:"row"
  },
  slider_style:{
    height:"70%",
    width:"60%"
  },
  slider_time:{
    fontSize:15,
    marginLeft:"6%",
    color:"#808080"
  },
	trackInfo: {
		padding: 40,
		backgroundColor: '#fff'
  },
  now_playing_text:{
    fontSize:19,
    marginLeft:"24%"
  },

	trackInfoText: {
		textAlign: 'center',
		flexWrap: 'wrap',
		color: '#550088'
	},
	largeText: {
		fontSize: 22
	},
	smallText: {
		fontSize: 16
	},
	control: {
		margin: 20
	},
	controls: {
    flexDirection:"row",
    height:"10%",
    width:"100%",
    alignItems:"center"
  },
  functions_view:{
    flexDirection:"row",
    height:"10%",
    width:"100%",
    alignItems:"center"
  },
  recently_played_view:{
    height:"25%",
    width:"100%",
  },
  recently_played_text:{
    fontWeight:"bold",
    fontSize:16,
    color:"#808080",
    marginLeft:"5%",
    marginTop:"6%"
  },
  recently_played_list:{
    backgroundColor:"#FFE3E3",
    height:"50%",
    width:"90%",
    borderRadius:10,
    marginLeft:"5%",
    marginTop:"5%",
    alignItems:"center",
    flexDirection:"row"
  },
  recently_played_image:{
    height:"80%",
    width:"20%",
    borderRadius:10
  },
  recently_played_list_text:{
    height:"100%",
    width:"60%",
    justifyContent:"center"
  },
  recently_played_list_text1:{
    fontSize:15,
    marginLeft:"8%"
  },
  recently_played_list_text2:{
    fontSize:16,
    color:"#808080",
    marginLeft:"8%"
  }
})