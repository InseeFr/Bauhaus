import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MenuReferentiels from './menu-referentiels';
import { dictionary } from '../utils/dictionary';
import '../../css/menu-concepts.css';

class MenuConcepts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuRef: false
    };
    this.onChangeMenu = () => {
      this.setState({
        menuRef: !this.state.menuRef
      });
    };
  }

  render() {
    const navbar = this.props.pink
      ? 'navbar navbar-default navbar-default-concepts-pink'
      : 'navbar navbar-default navbar-default-concepts';
    return (
      <div>
        <header>
          <nav className={navbar}>
            <div className="container-fluid">
              <div className="collapse navbar-collapse">
                <ul className="nav navbar-nav navbar-nav-concepts">
                  <li onClick={this.onChangeMenu}>
                    <a>
                      <div className="glyphicon glyphicon-th navbar-icon inline" />
                      <div className="inline">
                        {' '}{dictionary.navbar.concepts.home}
                      </div>
                    </a>
                  </li>
                  <li>
                    <Link to="/concepts">
                      {dictionary.navbar.concepts.concepts}
                    </Link>
                  </li>
                  <li>
                    <Link to="/collections">
                      {dictionary.navbar.concepts.collections}
                    </Link>
                  </li>
                </ul>
                <ul className="nav navbar-nav navbar-nav-concepts navbar-right">
                  <li>
                    <Link to="/help">
                      {dictionary.navbar.concepts.help}
                    </Link>
                  </li>
                  <li>
                    <Link to="/administration">
                      {dictionary.navbar.concepts.administration}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        {this.state.menuRef && <MenuReferentiels />}
      </div>
    );
  }
}

export default MenuConcepts;
