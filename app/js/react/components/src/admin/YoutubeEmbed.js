import React,{Component} from 'react';

export default class YoutubeEmbed extends Component{

    constructor(){
        super();
        this.state={
            embedId:""
        }
    }

    componentDidMount(){
        this.getEmbedId();
    }

    render(){
        return(
            <div className="video-responsive">
                <iframe
                width="853"
                height="480"
                src={'https://www.youtube.com/embed/'+this.state.embedId}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
                />
            </div>
        )
    }

    getEmbedId(){
        this.setState({
            embedId:this.props.embedId,
        })
    }
}