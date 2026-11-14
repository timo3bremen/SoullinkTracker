import PlayerBox from "./PlayerBox"

function LinkRow({ rowIndex, link, updatePlayer }) {
  return (
    <div className="link-row">
      {link.players.map((p, i) => (
        <PlayerBox
          key={i}
          value={p}
          onChange={(val) => updatePlayer(rowIndex, i, val)}
        />
      ))}
    </div>
  )
}

export default LinkRow