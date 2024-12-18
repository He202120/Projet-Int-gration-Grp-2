import { useState } from "react";
import { Button, Modal, Table, Form as BootstrapForm } from "react-bootstrap";
import { toast } from "react-toastify";
import { useBlockUserMutation, useUnblockUserMutation, useUpdateUserByAdminMutation, useDeleteUserMutation } from "../../slices/adminApiSlice";

const UsersDataTable = ({ users }) => {

  const [searchQuery, setSearchQuery] = useState("");

  const [showBlockingConfirmation, setShowBlockingConfirmation] = useState(false);
  const [showUnblockingConfirmation, setShowUnblockingConfirmation] = useState(false);

  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userIdToBlock, setUserIdToBlock] = useState(null);
  const [userIdToUnblock, setUserIdToUnblock] = useState(null);
  const [userNameToUnblock, setUserNametoUnblock] = useState(null);
  const [userMailToUnblock, setUserMailtoUnblock] = useState(null);
  const [userPlateToUnblock, setUserPlateToUnblock] = useState(null);
  const [userParkingToUnblock, setUserParkingToUnblock] = useState(null);
  const [userSubscriptionToUnblock, setUsersubscriptionToUnblock] = useState(null);
  const [userEnd_dateToUnblock, setUserEnd_dateToUnblock] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userIdToUpdate, setUserIdToUpdate] = useState("");
  const [userNameToUpdate, setUserNameToUpdate] = useState("");
  const [userEmailToUpdate, setUserEmailToUpdate] = useState("");
  const [userPlateToUpdate, setUserPlateToUpdate] = useState("");
  const [userParkingToUpdate, setUserParkingToUpdate] = useState("");
  const [userSubscriptionToUpdate, setUsersubscriptionToUpdate] = useState("");
  const [userEnd_dateToUpdate, setUserEnd_dateToUpdate] = useState("");
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [deleteUser, { isDeleteLoading }] = useDeleteUserMutation();
  const [blockUser, { isBlockingLoading }] = useBlockUserMutation();
  const [unblockUser, { isUnblockingLoading }] = useUnblockUserMutation();
  const [updateUserByAdmin, { isLoading: isUpdating }] = useUpdateUserByAdminMutation();

  const handleDelete = async () => {
    try {
      const responseFromApiCall = await deleteUser({ userId: userIdToDelete });
      toast.success("User Deleted Successfully.");
      setUserIdToDelete(null);
      setShowBlockingConfirmation(false);
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err?.error);
    }
  };

  const handleUnblock = async () => {
    try {
      const responseFromApiCall = await unblockUser({
        userId: userIdToUnblock,
        name: userNameToUnblock,
        plate: userPlateToUnblock,
        email: userMailToUnblock,
        parking_id: userParkingToUnblock,
        type_subscription: userSubscriptionToUnblock,
        subscription_end_date: userEnd_dateToUnblock
      });
      toast.success("User Accepted Successfully.");
      setUserIdToUnblock(null);
      setShowUnblockingConfirmation(false);
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err?.error);
    }
  };

  const handleOpenUpdateModal = (user) => {
    setUserIdToUpdate(user._id);
    setUserNameToUpdate(user.name);
    setUserEmailToUpdate(user.email);
    setUserPlateToUpdate(user.plate);
    setUserParkingToUpdate(user.parking);
    setUsersubscriptionToUpdate(user.type_subscription);
    setUserEnd_dateToUpdate(user.subscription_end_date);
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    try {
      const responseFromApiCall = await updateUserByAdmin({
        userId: userIdToUpdate,
        name: userNameToUpdate,
        email: userEmailToUpdate,
        plate: userPlateToUpdate,
        parking: userParkingToUpdate,
        type_subscription: userSubscriptionToUpdate,
        subscription_end_date: userEnd_dateToUpdate
      });
      toast.success("User Updated Successfully.");
      setUserIdToUpdate(null);
      setShowUpdateModal(false);
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err?.error);
    }
  };

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Firstname</th>
            <th>Email</th>
            <th>Plate</th>
            <th>requires_accessible_parking</th>
            <th>Status</th>
            <th>Update</th>
            <th>Delete</th>
            <th>Accept User</th>
            <th>Parking now</th>
            <th>Type_Subscription</th>
            <th>Subscription_End_Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.firstname}</td>
              <td>{user.email}</td>
              <td>{user.plate}</td>
              <td>{user.requires_accessible_parking? "☒" : "☑"}</td>              
              <td>{user.blocked ? "☒" : "☑"}</td>
              <td>
                <Button
                  type="button"
                  variant="primary"
                  className="mt-3"
                  onClick={() => handleOpenUpdateModal(user)}
                >
                  Update
                </Button>
              </td>
              <td>
                <Button
                  type="button"
                  variant="danger"
                  className="mt-3"
                  onClick={() => {
                    setUserIdToDelete(user._id);
                    setShowBlockingConfirmation(true);
                  }}
                >
                  Delete
                </Button>
              </td>
              <td>
                {user.blocked && (
                  <Button
                    type="button"
                    variant="success"
                    className="mt-3"
                    onClick={() => {
                      setUserIdToUnblock(user._id);
                      setUserNametoUnblock(user.name);
                      setUserMailtoUnblock(user.email);
                      setUserPlateToUnblock(user.plate);
                      setUserParkingToUnblock(user.parking_id);
                      setUsersubscriptionToUnblock(user.type_subscription);
                      setUserEnd_dateToUnblock(user.subscription_end_date);
                      setShowUnblockingConfirmation(true);
                    }}
                  >
                    Accept
                  </Button>
                )}
              </td>
              <td>{user.parking === 0 ? "pas dans un parking" : user.parking_id}</td>
              {/* Affichage sécurisé de type_subscription */}
              <td>{user.type_subscription?.name}</td>
              <td>{user.subscription_end_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <BootstrapForm>
        <BootstrapForm.Group
          className="mt-3"
          controlId="exampleForm.ControlInput1"
        >
          <BootstrapForm.Label>Search users:</BootstrapForm.Label>
          <BootstrapForm.Control
            style={{ width: "500px" }}
            value={searchQuery}
            type="text"
            placeholder="Enter Name or email..."
            onChange={handleSearch}
          />
        </BootstrapForm.Group>
      </BootstrapForm>

      <Modal
        show={showBlockingConfirmation}
        onHide={() => setShowBlockingConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowBlockingConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleteLoading}
          >
            {isDeleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUnblockingConfirmation}
        onHide={() => setShowUnblockingConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Accept</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to accept this user?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUnblockingConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleUnblock}
            disabled={isUnblockingLoading}
          >
            {isBlockingLoading ? "Confirming..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Plate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm>
            <BootstrapForm.Group controlId="plate">
              <BootstrapForm.Label>Plate</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={userPlateToUpdate}
                onChange={(e) => setUserPlateToUpdate(e.target.value)}
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersDataTable;
