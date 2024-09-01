import React, { useState } from 'react';
import { Button, Menu, MenuItem, IconButton, Divider, Tooltip } from '@material-ui/core';
import { ArrowDropDown, PersonAdd, Delete, CloudDownload } from '@material-ui/icons';
import { CloudUpload } from '@material-ui/icons';
import { useModalContext } from '../../contexts/ModalContext';
import '../Toolbar/toolbar.css';

const importOptions = [
  { label: 'CSV', accept: '.csv' },
  { label: 'Excel (XLSX)', accept: '.xlsx' },
  { label: 'JSON', accept: '.json' },
  { label: 'Parquet', accept: '.parquet' },
  // Add more file types as needed
];

const SpreadsheetToolbar = ({ onImportFile, onDeleteSpreadsheet }) => {
  const [inputValue, setInputValue] = useState('Untitled spreadsheet');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [importMenuEl, setImportMenuEl] = React.useState(null);
  const [downloadMenuEl, setDownloadMenuEl] = React.useState(null);

  const { setIsAddCollaboratorDialogOpen, setIsRemoveCollaboratorDialogOpen } = useModalContext(); // Use modal context

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleImportClick = (event) => {
    setImportMenuEl(event.currentTarget);
  };

  const handleDownloadClick = (event) => {
    setDownloadMenuEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setImportMenuEl(null);
    setDownloadMenuEl(null);
  };

  const handleFileChange = (event, fileType) => {
    onImportFile(event, fileType);
    handleMenuClose();
  };

  return (
    <>
      {/* <div className="spreadsheet-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Tooltip title="Import Options">
          <IconButton aria-controls="import-menu" aria-haspopup="true" onClick={handleImportClick} color="primary">
            <CloudUpload />
            <ArrowDropDown />
          </IconButton>
        </Tooltip>
        <Menu
          id="import-menu"
          anchorEl={importMenuEl}
          keepMounted
          open={Boolean(importMenuEl)}
          onClose={handleMenuClose}
        >
          {importOptions.map((option) => (
            <MenuItem key={option.label}>
              <input
                type="file"
                accept={option.accept}
                style={{ display: 'none' }}
                id={`import-${option.label}`}
                onChange={(e) => handleFileChange(e, option.label)}
              />
              <label htmlFor={`import-${option.label}`} style={{ width: '100%', cursor: 'pointer' }}>
                {option.label}
              </label>
            </MenuItem>
          ))}
        </Menu>

        <Tooltip title="Download Options">
          <IconButton aria-controls="download-menu" aria-haspopup="true" onClick={handleDownloadClick} color="primary">
            <CloudDownload />
            <ArrowDropDown />
          </IconButton>
        </Tooltip>
        <Menu
          id="download-menu"
          anchorEl={downloadMenuEl}
          keepMounted
          open={Boolean(downloadMenuEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Download as .csv</MenuItem>
          <MenuItem onClick={handleMenuClose}>Download as .xlsx</MenuItem>
          <MenuItem onClick={handleMenuClose}>Download as .pdf</MenuItem>
        </Menu>

        <Tooltip title="Collaborators">
          <IconButton aria-controls="collaborator-menu" aria-haspopup="true" onClick={handleMenuClick} color="primary">
            <PersonAdd />
            <ArrowDropDown />
          </IconButton>
        </Tooltip>
        <Menu id="collaborator-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => setIsAddCollaboratorDialogOpen(true)}>Add Collaborator</MenuItem>
          <MenuItem onClick={() => setIsRemoveCollaboratorDialogOpen(true)}>Remove Collaborator</MenuItem>
        </Menu>

        <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} />

        <Tooltip title="Delete Spreadsheet">
          <IconButton variant="contained" color="secondary" onClick={onDeleteSpreadsheet}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div> */}
      <div className="main">
        <img src="/image.png" alt="" />
        <div className="container-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <ul>
            <li>
              <button>File</button>
              <div className="dropdown">
                <ul>
                  <li>
                    <button>New SpreadSheet</button>
                  </li>
                  <li>
                    <button>Open</button>
                  </li>
                  <li>
                    <button onClick={handleImportClick}>Import</button>
                    <div className="dropdown3">
                      <ul>
                        {importOptions.map((option) => (
                          <li key={option.label}>
                            <input
                              type="file"
                              accept={option.accept}
                              style={{ display: 'none' }}
                              id={`import-${option.label}`}
                              onChange={(e) => handleFileChange(e, option.label)}
                            />
                            <label htmlFor={`import-${option.label}`} style={{ width: '100%', cursor: 'pointer' }}>
                              {option.label}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                  <li>
                    <button>Share</button>
                  </li>
                  <li>
                    <button onClick={handleDownloadClick}>Download</button>
                    <div className="dropdown3">
                      {/* <ul>
                        <li>
                          <button>Microsoft Excel (.xlsx)</button>
                        </li>
                        <li>
                          <button>PDF (.pdf)</button>
                        </li>
                        <li>
                          <button>Comma Separated Value (.csv)</button>
                        </li>
                      </ul> */}
                      <ul>
                        <li onClick={handleMenuClose}>Download as .csv</li>
                        <li onClick={handleMenuClose}>Download as .xlsx</li>
                        <li onClick={handleMenuClose}>Download as .pdf</li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <button>Rename</button>
                  </li>
                  <li>
                    <button onClick={onDeleteSpreadsheet}>Delete</button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button>Edit</button>
              <div className="dropdown">
                <ul>
                  <li>
                    <button>Undo</button>
                  </li>
                  <li>
                    <button>Redo</button>
                  </li>
                  <li>
                    <button>Cut</button>
                  </li>
                  <li>
                    <button>Copy</button>
                  </li>
                  <li>
                    <button>Paste</button>
                  </li>
                  <li>
                    <button>Delete</button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button>Insert</button>
              <div className="dropdown">
                <ul>
                  <li>
                    <button>Cells</button>
                    <div className="dropdown1">
                      <ul>
                        <li>
                          <button>Insert cell and shift Right</button>
                        </li>
                        <li>
                          <button>Insert cell and shift Down</button>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <button>Rows</button>
                    <div className="dropdown1">
                      <ul>
                        <li>
                          <button>Insert one row above</button>
                        </li>
                        <li>
                          <button>Insert one row below</button>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <button>Columns</button>
                    <div className="dropdown1">
                      <ul>
                        <li>
                          <button>Insert one column above</button>
                        </li>
                        <li>
                          <button>Insert one column below</button>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button>Format</button>
              <div className="dropdown">
                <ul>
                  <li>
                    <button>Text</button>
                    <div className="dropdown2">
                      <ul>
                        <li>
                          <button>Bold</button>
                        </li>
                        <li>
                          <button>Italic</button>
                        </li>
                        <li>
                          <button>Underline</button>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <button>Alignment</button>
                    <div className="dropdown2">
                      <ul>
                        <li>
                          <button>Left</button>
                        </li>
                        <li>
                          <button>Center</button>
                        </li>
                        <li>
                          <button>Right</button>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <button>Font Size</button>
                    <div className="dropdown2">
                      <ul>
                        <li>
                          <button>6</button>
                        </li>
                        <li>
                          <button>7</button>
                        </li>
                        <li>
                          <button>8</button>
                        </li>
                        <li>
                          <button>10</button>
                        </li>
                        <li>
                          <button>12</button>
                        </li>
                        <li>
                          <button>14</button>
                        </li>
                        <li>
                          <button>18</button>
                        </li>
                        <li>
                          <button>20</button>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button>Collaborators</button>
              <div className="dropdown">
                <ul>
                  <li onClick={() => setIsAddCollaboratorDialogOpen(true)}>Add Collaborator</li>
                  <li onClick={() => setIsRemoveCollaboratorDialogOpen(true)}>Remove Collaborator</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="container-2">
          <div>
            <ul>
              <li>
                <button>Share</button>
              </li>
            </ul>
          </div>
          <div className="profile">
            <img
              src="https://lh3.googleusercontent.com/fife/ALs6j_HJL7asJLfMleJoxOVK9OaWXfI3MacJxDTqx5jx-G6CtAXJiDEgwvHFXLDoby0v72ZGGDnelxnjNw4bza3UdLEZqA4CHFJU_53Xv8s7tK7o0zURh-e4u0tiqdW8DCi29p1XJSCp1Br6Cz_zQTIizyRM_3Aqf4OkXQTWHnDe5AOgEq4V8pBC62yMACq3K5KX7QNM-ERGbj69NN5G3O3ppnOni9C8elnLStQzsbRSsSM8XUaVzv-UGcnUWUrzkMPMXyRRrJsP9Bze7NbKGlYIrclp0NFPZrvzrXHkjfgBM_uxsd8XVvvW9wANcUgCWdYqDBHZz0zLVsjESMQqDwyJ8gP2hlW4IwTXsS4yef3XA_d6Ah8kE5PLkEkUTEiqSaTtfUqBg6pPEL1m30EhB3dsOcODc_75FPo5y-LHuOXZjIx60g5yuAkxWxARWnedal8gCFRpGbnlzWnknUG5NequNMRumy5bDTQLjrIoeWLUwEGfBcowEbHXeNIfoXaOYu152_B6gSDcdTWqip4K3KmcbzRGKqr0rfwjuAp56TgnvmXrDecy-0TYrjHyeccX0ts0tnFuN_jthNWvDS_8xHN2L70ja8NzHuEXq3n2XJgg925cvOwF3_cNW-lA7GzDgSHGd04gvlket6Ch0sB-itPw0_oFO1fQHcChzXRDIKNm3jojUCREGdrZDlU6xcP_qEODaXABI5LJjaRVI_c54nmH62O5INhLIV6c--nxjtqktJ9J2P7a042iFtTD51YgscS_1P5S2nLSYzoIfjXqHzpnA4Fj5-nEx3iBO5Oa9neWXlD6wAygDOSrb3T15DP4qCSGz3p9jNtQi289EANfEMczmz1iljfbB_bc2h9cz_JnYsxhGcEia078IkLuAWGG92Qfi6YLdr7op39IkaNNtjcdPUkWXqfGwy3R6Td37HcZju1NGm4dcKUvik6gZMy8QN3P8cqpvUoVTs4AmCl2adb7hS8_jm5sH8zXnLxvC5vGnAzLYJYzwAleXRj209E7LkV446oU_VJ0LPoHWOQ3RDxWUvX1r7AIf4ZKeSmqwKYtNLeInSICULPEDLO0S_O_Keub88lJ8wFI_sGS5j01qYBZDbqyvbQDEnbLPbuWCLNm7bM_mIM9pkel-2KNbNXcsWbNRUhei6rqaqmMo5M2qQlm9JA6hvibzYHsIOqf-mVO4ZZI-WZsp55Bknq7w4OTJ21sbJ0UvGyjmCEJ8KyoBf5eOO7iBj0XP1nFj2eF20kp5ai5M-4aJNghfRp-aPIa5ye_Mj5sf7ybtSrp17t0aW5YgYd0lVnaSvLt70S2GnnWIbCmmecb6HkPb5Qk5m7m8q5eZCqiQq7T3ouEVRlgtaB3XDtcHNgHy0ol5Yt8d6KLOXaAym6v_8VSUxt9t-4GdeCPoXDcMa9QKRxvbo0=s64-c"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SpreadsheetToolbar;
