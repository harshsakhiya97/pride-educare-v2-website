import React, { useContext, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import axios from '../helper/axios';
import { AuthContext } from '../context/AuthContext';

export default function AttendanceBatchListModal(props) {
  // console.log('props.data', props);
  const [batch, setBatch] = useState("");
  const [isError, setError] = useState(false);
  const { token } = useContext(AuthContext);
  const setBatchDataApi = async () => {
    if (!batch) {
      setError(true);
    } else {
      let details = ({
        "batchStudentMaster": {
          "batchStudentMasterId": batch
        },
        "studentLectureMaster": {
          "studentLectureMasterId": props.studentLectureMasterId
        },
        "type": "PRESENT"
      })
      try {
        const response = await axios.post(`attendance/save`, details,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        props.fetchAttendanceBatchList();
        props.hide();
      } catch (error) {
        console.error("Error Fetching Lecture Data", error);
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
          <Modal.Title>Select Offline Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body className="user-select-none p-4">
          <select
            onChange={(e) => {
              setBatch(e.target.value)
              setError(false)
            }}
            value={batch}
            className="form-select"
            aria-label="Select Batch"
            required
          >
            <option defaultValue value="">Select Batch</option>
            {
              props.data.map((item) => {
                return (
                  <option
                    key={item.batchStudentMasterId}
                    value={item.batchStudentMasterId}>
                    {item.batchMaster.batchName}
                  </option>
                )
              })
            }
          </select>
          {isError && <span className='error'>Please select value</span>}
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-primary' onClick={() => setBatchDataApi()}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
