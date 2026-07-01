'use client';

import React, { useState } from "react";
import knitGrid from "./KnittingGrid.module.css"

type Stitches = string

// Amount of cast on stitches to start project
type KnittingGridProps = {
    stitches: number
    nameOfProject: string
}

interface needles {
    type: string
    size: number
}

interface yarn {
    material: string
    weight: number
    yardage: number
}

// Begins the project. first row is the cast ons,
// has second row to initialize the grid itself.
function createKnitProject(stitches: number, rows: number): Stitches[][] {
    return Array.from({ length: rows }, 
        () => Array.from({length: stitches}, () => ""))
}

/* The grid to store a persons knitting project progress/information */
// stitches refers to the amount of cast-on stitches to start the project
export default function KnittingProject({stitches, nameOfProject} : KnittingGridProps) {
    const [selectedStitches, setSelectedStitches] = useState<Set<string>>(new Set())
    const [selectedNeedles, setSelectedNeedless] = useState<needles>()
    const [currentPosition, setCurrentPosition] = useState<string>(`${stitches},20`)
    const [selectedYarn, setSelectedYarn] = useState<yarn>()
    const [selectedHighlightColor, setSelectedHighlightColor] = useState<string>("yellow")
    const [startSelecting, setStartSelecting] = useState<boolean>(false)
    const [knittingGrid, setKnittingGrid] = useState<Stitches[][]>(() => createKnitProject(stitches, 20)) // Creates the grid
    const [projectName, setProjectName] = useState<string>(() => nameOfProject) // Change project name

    // Updates the stitch at it's given row and column
    function updateIndividualStitch(stitchRow: number, stitchCol: number, stitchType: Stitches) {
        setKnittingGrid(prevKnitGrid => {
            const updatedKnitGrid = prevKnitGrid.map((row, stitch) => {
                
                // Person does not want to change this row
                if (stitch !== stitchRow) {
                    return row
                }
                
                // This is where they want to update the stitch
                return row.map((stitch, col) => {
                    if (col != stitchCol) {
                        return stitch
                    }

                    return stitchType
                })
            })

            // Return the progress on the project!
            return updatedKnitGrid
        })
    }

    // User can select multiple stitches to go back if they want to,
    // edit a row, etc.
    function selectMultipleStitches(stitchRow: number, column: number) {

        if (startSelecting == true) {
            // We will create a key from the row + column
            // since that creates a unique value for each stitch
            const key = stitchRow.toString() + "," + column.toString()

            // Select the new stitches
            setSelectedStitches(previousSelected => {
                const newlySelectedStitches = new Set(previousSelected)
                newlySelectedStitches.add(key)
                return newlySelectedStitches
            })

        }
    }

    // The users project information
    return  (
        // The grid to store a persons knitting project progress/info
        <div>
            <div>
            <div className={knitGrid.projectHeaders}>
                <p>Knitting project: {projectName}</p>
            </div >
            <div className={knitGrid.needles}>
                <p> Needles: </p>
                <input className={knitGrid.needleInfo} value={selectedNeedles?.type}/>
                <p> Size: </p>
                <input className={knitGrid.needleInfo} value={selectedNeedles?.size}/>
            </div>
            <div className={knitGrid.yarn}>
                <p> Material: </p>
                <input className={knitGrid.yarnInfo} value={selectedYarn?.material}/>
                <p> Weight: </p>
                <input className={knitGrid.yarnInfo} value={selectedYarn?.weight}/>
                <p> Yardage: </p>
                <input className={knitGrid.yarnInfo} value={selectedYarn?.yardage}/>
                 <p className="ml-15" >More row info</p>
            </div>            
            </div>
            <table>
                <tbody>
                    {knittingGrid.map((row, rowNumber) => (
                        <tr key={rowNumber} className={knitGrid.stitchRowLayout}>
                            {/* Set a fixed width and height for row numbers, formatting breaks with numbers > 1000 */}
                            <th className="w-8 h-6">{1 + rowNumber++}</th>
                            {row.map((stitch, colIndex) => (
                            <td className={selectedStitches.has((rowNumber -1).toString() + "," + colIndex.toString()) ? knitGrid.stitchSelected : knitGrid.stitch} 
                            style={{backgroundColor: selectedStitches.has((rowNumber -1).toString() + "," + colIndex.toString()) ?  selectedHighlightColor : undefined}}
                            key={colIndex} 
                            onMouseDown={() => setStartSelecting(true)}
                            onMouseUp={() => setStartSelecting(false)}
                            onKeyDown={(event) => {
                                // Cancel the selection
                                if (event.key === "Escape") {
                                    setSelectedStitches(new Set())
                                }
                                
                                // Go to currently selected row
                                if (event.key === "Enter") {
                                    
                                    if (rowNumber < Number(currentPosition?.substring(0, currentPosition.indexOf(',')))) {
                                        const confirmation = confirm(`Are you sure you want to go to row: ${rowNumber}, stich ${colIndex}?`)
                                        
                                        // Go to that row
                                        if (confirmation) {
                                            setKnittingGrid(Array.from({ length: (rowNumber + 1) }, () => Array.from({length: stitches}, () => "")))
                                            setCurrentPosition(`${rowNumber},${colIndex}`)
                                        }
                                        // Do nothing
                                        else {
                                        }
                                    }
                                    else {
                                        setKnittingGrid(Array.from({ length: rowNumber + 1 }, () => Array.from({length: stitches}, () => "")))
                                        setCurrentPosition(`${rowNumber},${colIndex}`)
                                    }
                                }

                            }}
                            onMouseMove={(e) => selectMultipleStitches(rowNumber - 1, colIndex)}>
                                <input 
                                    className={knitGrid.stitchInput}
                                    value={stitch}
                                    onChange={(event) => updateIndividualStitch(rowNumber - 1, colIndex, event.target.value)}
                                />
                            </td>
                            ))}
                        <td>
                            <input className={knitGrid.additionalRowInfo}/>
                        </td>
                        </tr>
                    )
                    )}
                </tbody>
            </table>
            <div>
                <p>Additional project notes:</p>
                <textarea className={knitGrid.additionalProjectInfo}> </textarea>
                <div className="flex">
                    <p> Highlight color: </p>
                    <input type="color" onChange={(event) => setSelectedHighlightColor(event.target.value)}></input>
                </div>        
            </div>
        </div>
    )
    
}