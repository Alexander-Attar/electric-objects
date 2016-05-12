/**
 * Electric Objects
 * Image Gallery
 * Alexander Attar
 * Spring 2016
 *
 */


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var URL = 'https://open-api.electricobjects.com/v4/artworks';
var ARTWORK_ID = getParameterByName('artwork_id')
var ARTWORK_URI =getParameterByName('artwork_uri')
var ARTWORK_URL = 'https://electric-objects-web-production-attachments.imgix.net/' + ARTWORK_URI

var ImageDetail = React.createClass({
  render: function() {
    return (
        <img className={"img-fluid detail m-b-2"} src={ARTWORK_URL} />
    );
  }
});

var Recommended = React.createClass({
  render: function() {
    var recNodes = this.props.recs.map(function(rec) {
      return (
          <img className={"center-block img-fluid col-md-2 col-xs-12 card"}
               src={rec.static_previews[4].url} key={rec.id} />
      );
    });

    return (
      <div>
        {recNodes}
      </div>
    );
  }
});

var Favorites = React.createClass({
  render: function() {
    var favNodes = this.props.favs.map(function(fav) {
      return (
        <div className={"pull-xs-left m-r-1"} key={fav.id}>
          <img className={"avatar img-circle"} src={fav.avatar_images[0].url} />
        </div>
      );
    });

    return (
      <div>
        <div className={"heart pull-xs-left m-t-1 m-r-1"}>
          <i className="fa fa-heart-o fa-lg"></i>
        </div>
        {favNodes}
      </div>
    );
  }
});

var ImageBox = React.createClass({
  getInitialState: function() {
    return {
      favs: [],
      recs: [],
      loading: true
    };
  },
  componentDidMount: function() {
    this.getData();
  },
  getData: function() {
    var getFavorites = $.jsonp({
      url: 'https://open-api.electricobjects.com/v4/artworks/'+ARTWORK_ID+'/users/favorited',
      success: function(data) {
        return data
      }.bind(this),
      error: function(err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

    var getRecs = $.jsonp({
      url: 'https://open-api.electricobjects.com/v4/artworks/'+ARTWORK_ID+'/recommended/?limit=18',
      success: function(data) {
        return data
      }.bind(this),
      error: function(err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

    $.when(getFavorites, getRecs).done(function(favs, recs) {
      this.setState({favs: favs[0]});
      this.setState({recs: recs[0]});
    }.bind(this));
  },
  render: function() {
    return (
      <div className={"imageBox"}>
        <h1 className="jumbotron text-xs-center"><a href={'/index.html'}>Electric Objects</a></h1>

        <div className={"row"}>
          <div className={"col-xs-12 col-sm-6 col-md-6"}>
            <ImageDetail  />
          </div>

          <div className={"col-xs-12 col-sm-12 col-md-6 text-xs-center"}>
            <h4>Recommended</h4>
          </div>

          <div className={"col-xs-12 col-sm-12 col-md-6"}>
            <Recommended recs={this.state.recs} />
          </div>
        </div>

        <div className={"row favorites m-t-1 m-b-1"}>
          <div className={"col-xs-12"}>
            <Favorites favs={this.state.favs} />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <ImageBox/>,
  document.getElementById('content')
);