import React, { Component } from "react";
import { Link } from "react-router-dom";

class Logo extends Component {
    render() {
        return "PIRE MAP";
    }
}

class AvatarUser extends Component {
    render() {
        //console.log('TopMenu', this.props.user)
        return (
            <React.Fragment>
                <div className="avatar-w" style={{ border: "none" }}>
                    <i className="pre-icon os-icon os-icon-user-male-circle" />
                </div>
                <div className="logged-user-info-w">
                    <div className="logged-user-name">
                        {this.props.user.email
                            ? this.props.user.email.length > 18
                                ? this.props.user.email.slice(0, 15) + "..."
                                : this.props.user.email
                            : ""}
                    </div>
                    <div className="logged-user-role">
                        {this.props.user.activeGroup
                            ? this.props.user.activeGroup.length > 18
                                ? this.props.user.activeGroup.slice(0, 15) +
                                  "..."
                                : this.props.user.activeGroup
                            : ""}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class LoginMenu extends Component {
    render() {
        return (
            <Link to={"/login"} style={{ color: "#fff" }}>
                <div className="icon-w">
                    <div className="pre-icon os-icon os-icon-user-male-circle" />
                </div>
                <span>LOGIN </span>
            </Link>
        );
    }
}

class TopSearch extends Component {
    render() {
        return (
            <div className="element-search autosuggest-search-activator">
                <input placeholder="Start typing to search..." type="text" />
            </div>
        );
    }
}

class TopNav extends Component {
    render() {
        return (
            <span style={{ width: "100%" }}>
                <Logo />
                <TopSearch />
                <AvatarUser />
                <LoginMenu />
            </span>
        );
    }
}

export default TopNav;
export { Logo, TopSearch, LoginMenu, AvatarUser };
