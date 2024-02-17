import React, { useContext, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import axios from '../helper/axios';
import { AuthContext } from '../context/AuthContext';

export default function PracticeAttendanceModal(props) {
  console.log('props.data', props);
  const [franchiseMasterId, setFranchiseMasterId] = useState("");
  const [staffMasterId, setStaffMasterId] = useState("");
  const [isError, setError] = useState(false);
  const { token } = useContext(AuthContext);
  const savePracticeAttendance = async () => {
    if (!franchiseMasterId || !staffMasterId) {
      setError(true);
    } else {
      let details = ({
        "franchiseMaster": {
          "franchiseMasterId": franchiseMasterId
        },
        "staffMaster": {
          "staffMasterId": staffMasterId
        },
        "batchTime": {
          "predefinedId": props.batchTime.predefinedId
        },
        "type": "PRACTICE"
      })
      props.loading(true);
      try {
        const response = await axios.post(`attendance/save`, details,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        props.getPracticeAttendance();
        props.hide();
        props.loading(false);
      } catch (error) {
        console.error("Error Saving Attendance", error);
        props.loading(false);
      }
    }

  };
  return (
    <div>
      <Modal
        show={props.show}
        onHide={() => props.hide()}
        // className="payment-modal"
        size="lg"
      >
        <Modal.Header className="p-4" closeButton>
          <Modal.Title>Practice Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body className="user-select-none p-4">
          <div className="container">
          <div className="row">

            <div className="col-md-6">
              <select
                onChange={(e) => {
                  setFranchiseMasterId(e.target.value)
                  props.fetchStaffList(e.target.value)
                  setError(false)
                }}
                value={franchiseMasterId}
                className="form-select"
                aria-label="Select Branch"
                required
              >
                <option defaultValue value="">Select Branch</option>
                {
                  props.franchiseList.map((item) => {
                    return (
                      <option
                        key={item.franchiseMasterId}
                        value={item.franchiseMasterId}>
                        {item.shortName}
                      </option>
                    )
                  })
                }
              </select>

            </div>
            <div className="col-md-6">
              <select
                onChange={(e) => {
                  setStaffMasterId(e.target.value)
                  setError(false)
                }}
                value={staffMasterId}
                className="form-select"
                aria-label="Select Branch"
                required
              >
                <option defaultValue value="">Select Trainer</option>
                {
                  props.staffList.map((item) => {
                    return (
                      <option
                        key={item.staffMasterId}
                        value={item.staffMasterId}>
                        {item.name}
                      </option>
                    )
                  })
                }
              </select>

            </div>

            </div>
          </div>

          {isError && <span className='error'>Please select value</span>}
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-primary' onClick={() => savePracticeAttendance()}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
