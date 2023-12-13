import React from 'react'
import { Table } from 'react-bootstrap'
import dateFormat from 'dateformat'
import { motion } from 'framer-motion'

const channel = dateFormat(new Date(), 'yyyymmdd')
const socket = '127.0.0.1:3001'
const ws = new WebSocket(`ws://${socket}/ws/sub/${channel}`)

export class PnlData extends React.Component {
  constructor() {
    super()
    this.state = {
      tableData: [],
    }
  }

  componentDidMount() {
    ws.onmessage = (e) => {
      let records = []
      const data = JSON.parse(e.data)
      records.push({ key: data.ssid, data: data.timestamp })
      this.setState({ tableData: records })
    }
  }

  render() {
    return (
      <Table striped bordered hover>
        <thead style={{ position: 'sticky', top: '0' }}>
          <tr>
            <th>N.</th>
            <th>SSID</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {this.state.tableData.map((row, index) => {
            return (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
                key={row.key}
                transition={{
                  opacity: { duration: 0.5 },
                }}
              >
                <td>{index + 1}</td>
                <td>{row.key}</td>
                <motion.td
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  key={row.data}
                  transition={{
                    opacity: { duration: 0.5 },
                  }}
                >
                  {row.data}
                </motion.td>
              </motion.tr>
            )
          })}
        </tbody>
      </Table>
    )
  }
}
