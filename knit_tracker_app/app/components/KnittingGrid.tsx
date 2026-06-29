"use client";

import { useState } from "react";
import knitGrid from "./KnittingGrid.module.css"

type Stitches = string

// Amount of cast on stitches to start project
type KnittingGridProps = {
    stitches: number
    nameOfProject: string
}

// Begins the project. first row is the cast ons,
// has second row to initialize the grid itself.
function createKnitProject(stitches: number, rows: number): Stitches[][] {
    return Array.from({ length: rows }, 
        () => Array.from({length: stitches}, () => ""))
}

/* The grid to store a persons knitting project progress/information */
// stitches refers to the amount of cast-on stitches to start the project
export default function KnittingGrid({stitches, nameOfProject} : KnittingGridProps) {
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

    // The users kniting grid
    return  (
        <div>
            <div className={knitGrid.projectHeaders}>
                <p>Knitting project: {projectName}</p>
                <p>More row info</p>
            </div>
            <table>
                <tbody>
                    {knittingGrid.map((row, rowNumber) => {
                    return (
                        <div className={knitGrid.stitchRowLayout}>
                            <tr key={rowNumber}>
                                {/* Set a fixed width and height for row numbers, formatting breaks with numbers > 1000 */}
                                <th className="w-8 h-6">{1 + rowNumber++}</th>
                                {row.map((stitch, colIndex) => (
                                <td className={knitGrid.stitch} key={colIndex}>
                                    <input 
                                        className={knitGrid.stitchInput}
                                        value={stitch}
                                        onChange={(event) => updateIndividualStitch(rowNumber - 1, colIndex, event.target.value)}
                                    />
                                </td>
                                ))}
                            </tr>
                            <input className={knitGrid.additionalRowInfo}>
                            </input>
                        </div>
                    )
                    })}
                </tbody>
            </table>
        </div>
    )
    
}