/**
 * Electric Objects
 * Image Gallery
 * Alexander Attar
 * Spring 2016
 *
 */

var URL = 'https://open-api.electricobjects.com/v4/artworks';
var OFFSET = 20;

var Image = React.createClass({
  render: function() {
    return (
      <div className={"image card col-lg-3 col-sm-6"}>
        <div className="card-header">
          <img className={"avatar img-circle img-responsive m-r-1"} src={this.props.avatar} />
          <h6 className={"text-muted m-t-1"}>@{this.props.username}</h6>
        </div>
        <a href={'/detail.html?artwork_id=' + this.props.id +
                '&artwork_uri=' + this.props.url.split('.net/')[1].split('?')[0]}>
          <img className={"center-block img-fluid"} src={this.props.url} />
        </a>
        <h6 className={"title text-capitalize m-t-1 text-xs-center"}>
          {this.props.title}
        </h6>
      </div>
    );
  }
});

var ImageList = React.createClass({
  render: function() {
    var imageNodes = this.props.data.map(function(image) {
      return (
        <Image
          id={image.id}
          title={image.title}
          key={image.id}
          url={image.static_previews[5].url}
          avatar={image.user.avatar_images[0].url}
          username={image.user.username}>
        </Image>
      );
    });

    return (
      <div className={"imageList row"}>
          {imageNodes}
      </div>
    );
  }
});

var ImageGallery = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: true
    };
  },
  componentDidMount: function() {
    this.onChangePage(1);
  },
  getData: function(page) {
    var url = URL + '?limit=' + OFFSET + '&offset=' + OFFSET * (page - 1)
    return  $.jsonp({
      url: url,
      success: function(data) {
        return data
      }.bind(this),
      error: function(err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  onChangePage: function(page) {
    this.setState({
      loading: true
    });

    this.getData(page).then(function(data) {
      this.setState({
        data: data,
        loading: false
      });
    }.bind(this));
  },
  render: function() {
    return (
      <div className="imageGallery">
        <h1 className="jumbotron text-xs-center"><a href={'/index.html'}>Electric Objects</a></h1>
        <ImageList data={this.state.data} />
        <Paginator max={100} onChange={this.onChangePage} />
      </div>
    );
  }
});

var Paginator = React.createClass({
  propTypes: {
    max: React.PropTypes.number.isRequired,
    maxVisible: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.props.onChange(this.state.currentPage);
    }
  },
  getDefaultProps: function() {
    return {
      maxVisible: 5
    };
  },
  getInitialState: function() {
    return {
      currentPage: 1,
      data: []
    };
  },
  goTo: function(page) {
    this.setState({currentPage: page});
  },

  onClickNext: function() {
    var page = this.state.currentPage;

    if (page < this.props.max) {
      this.goTo(page + 1);
    }
  },
  onClickPrev: function() {
    if (this.state.currentPage > 1) {
      this.goTo(this.state.currentPage - 1);
    }
  },
  render: function() {
    var className = this.props.className || '',
      p = this.props,
      s = this.state,
      skip = 0;

    if (s.currentPage > p.maxVisible - 1 && s.currentPage < p.max) {
      skip = s.currentPage - p.maxVisible + 1;
    } else if (s.currentPage === p.max) {
      skip = s.currentPage - p.maxVisible;
    }

    if (s.currentPage == 1) {
      var iterator = Array.apply(null, Array(p.maxVisible)).map(function(v, i) {
        return skip + i + 1;
      });
    } else {  // display more options by shifting last page to the first
      var iterator = Array.apply(null, Array(p.maxVisible)).map(function(v, i) {
        return skip + i + 4;
      });
    }

    return (
      <nav className="text-xs-center">
        <ul className={'pagination'}>
          <li className={s.currentPage === 1 ? 'page-item disabled' : 'page-item'}>
            <a className="page-link" href="#" onClick={this.onClickPrev}>
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Prev</span>
            </a>
          </li>
          {iterator.map(function(page) {
            return (
              <li key={page}
                onClick={this.goTo.bind(this, page)}
                className={s.currentPage === page ? 'page-item active' : 'page-item'}>
                <a className="page-link" href="#">{page}</a>
              </li>
            );
          }, this)}
          <li className={s.currentPage === p.max ? 'page-item disabled' : 'page-item'}>
            <a className="page-link" href="#" onClick={this.onClickNext}>
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
});

ReactDOM.render(
  <ImageGallery/>,
  document.getElementById('content')
);
