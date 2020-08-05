import React from 'react';
import { Badge } from 'react-bootstrap'

const CypherResultCytoscapeFooter = ({ footerData }) => {
  const extractData = (d) => {
    let extractedData = []
    for (const [alias, val] of Object.entries(d)) {
      extractedData.push(<span className="label"><strong className="pl-3">{alias} : </strong> {val}</span>)
    }
    return extractedData
  }
  const displayFooterData = () => {

    if (footerData.type === 'elements') {
      return (
        <div>
          <Badge className="px-3 py-1 ml-3 " pill style={{ backgroundColor: footerData.data.backgroundColor, fontSize: '0.9rem' }}>{footerData.data.label}</Badge>
          <span className="label"><strong className="pl-3">&lt;gid&gt; : </strong> {footerData.data.id}</span>
          {extractData(footerData.data.properties)}
        </div>
      )

    } else if (footerData.type === 'background') {
      return <span className="label pl-3">Displaying {footerData.data.nodeCount} nodes, {footerData.data.edgeCount} edges</span>
    }
  }

  return <div className="chart-footer-area">
    {displayFooterData()}
  </div>
}


export default CypherResultCytoscapeFooter