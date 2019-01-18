import React, { Component } from "react";
import App from "./../App";
import styles from "./../styles/RoomList.css";

class RoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      newRoomName: "",
      roomId: ""
    };
    this.roomsRef = this.props.firebase.database().ref("rooms");
  }

  componentDidMount() {
    this.roomsRef.on("child_added", snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room) });
    });
    this.roomsRef.on("child_added", snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room) });
      if (this.state.rooms.length === 1) {
        this.props.setActiveRoom(room);
      }
    });
    this.roomsRef.on("child_removed", snapshot => {
      this.setState({
        rooms: this.state.rooms.filter(room => room.key !== snapshot.key)
      });
    });
    console.log(this.roomsRef);
  }

  createRooms(newRoomName) {
    this.roomsRef.push({
      name: newRoomName
    });
  }

  deleteRoom = roomName => {
    console.log("Delete Room Triggered");
    const newRoomsArray = [];
    this.state.rooms.map((room, i) => {
      if (room.key != roomName.key) {
        newRoomsArray.push(room);
      }
    });
    this.setState({ rooms: newRoomsArray });
    console.log(this.state.rooms);
  };

  handleChange(e) {
    this.setState({ newRoomName: e.target.value });
  }

  render() {
    return (
      <React.Fragment>
        <div className="available-rooms">
          {this.state.rooms.map((room, i) => (
            <a>
              <p key={i} onClick={() => this.props.setActiveRoom(room)}>
                Room name: {room.name}
              </p>
              <input
                className="delete-room"
                type="button"
                value="Delete this room"
                onClick={e => this.deleteRoom(room)}
              />
            </a>
          ))}
        </div>

        <div className="new-room-form">
          <h1>Add a new chatroom!</h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              this.createRooms(this.state.newRoomName);
            }}
          >
            <label for="roomName">Room Name: </label>
            <input
              type="text"
              id="roomName"
              value={this.state.newRoomName}
              onChange={e => this.handleChange(e)}
            />
            <input type="submit" />
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default RoomList;
