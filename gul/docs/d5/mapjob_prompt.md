You are tracing walkable cell grids for top-down battle-map images used by a tactical game. Work only inside this folder:
SP=/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad

Your job list: SP/d5/mapjobs_N.tsv (tab-separated: title, id, name, tag, nx (blank = default), note). For each row, the image is SP/d5/raw/<title>.png. You produce ONE file per row: SP/d5/fix/<title>.txt. Do not edit any other file.

Grid basics
- The image is cut into square cells: NX columns = nx from the row, or round(image width / 45) if blank; NY = round(height / cell size). Cell (x,y), 0-based, x to the right, y down.
- Cell values: '.' floor (walkable), '#' blocked (walls, cliffs, deep water, buildings, big trees, crowds, void), 'r' low cover (crates, rubble, low walls, bushes — walkable-around obstacles that stop movement but not sight).
- Units are about half a cell wide. Keep paths at least 2 cells wide where the art allows. Rooms with furniture: beds, tables, stoves, shelves = 'r' or '#'.

Fix-file format (lines; '#!' starts a comment):
  #! <short description of the map> v1
  0-22,0-33=#            (x0-x1,y0-y1=value — fills a rectangle; single numbers allowed: 5,7=r)
  9-13,0-33=.            (later lines override earlier ones)
  id=<id from row>
  name=<name from row>
  tag=<tag from row>
  in=x0-x1,y0-y1         (entry zone where the party starts: ≥ 7 floor cells, at the map edge where a road/door enters — usually bottom for tall maps, left for wide maps)
  out=x,y                (exit stairs cell: a floor cell far from the entry, reachable from it; usually the opposite edge)
  amb=0.4..1.0           (ambient light: 0.4 very dark, 0.55 dim night, 0.7 normal, 1.0 bright white)
  nx=<n>                 (only if the row gives nx)
  fall=1                 (only for rooftop maps marked fall=1 in the note)

Recommended method (proven): start with the whole map blocked, then paint floor rectangles that follow the walkable ground in the art, then mark obstacles inside the floor as 'r' or '#'. Example for a 23x34 map: first line `0-22,0-33=#`, then rows of `x0-x1,y=.` / `x0-x1,y0-y1=.` tracing the road. For open fields (planet surface, desert, plazas), do the opposite: `0-(NX-1),0-(NY-1)=.` then block the edges/objects.

Tools
- python3 -I SP/tools/mapchk.py "<title>"   → builds the grid from your fix file, writes SP/d5/grid/<title>_ov.jpg (red = '#', yellow = 'r', green box = in, blue cell = out, cell numbers along the top and left edges; numbers every 5 in cyan), and prints OK or the problems (in too small, out not floor, no path in→out, missing keys).
- Run it once with no fix file first to get the numbered overlay of the raw image (red = auto guess) — use the numbers to read cell coordinates. Then write the fix file, run again, Read the overlay image to check it matches the art, correct, repeat until the printed line ends with OK and the overlay looks right. Look at each final overlay at least once.

Special notes
- Rows with tag 'stage' are story rooms/places: still trace them fully (furniture as r/#).
- 'caldera' (nx 56): a very large crater map; the exit `out` must be on the bed shown in the image (a bed in the crater). 'calderap' (nx 40): the past caldera.
- 'mouth' (nx 72): long desert strip with a giant mouth at one end — floor almost everywhere; in at the far left, out next to the mouth.
- 'champ': vertical corridor — only the central road is floor; crowds/railings on both sides are '#'; in at the bottom, out at the top.
- Wide strips (2172x724): in on the left edge, out on the right edge.

When all rows are done, reply with one line per map: title → final mapchk line. Keep the reply short.
