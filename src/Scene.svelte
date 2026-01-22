<script lang="ts">
  import CursorLine from './CursorLine.svelte'
  import type { Vector3Tuple } from 'three'
  import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras'
  import { Spring } from 'svelte/motion'
  import { T } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  interactivity()
  const cursorPosition = new Spring<Vector3Tuple>([0, 0, 0])
const colors = ['#00FFFF', '#00E5FF', '#00CCFF', '#00B2FF', '#0099FF', '#0080FF'];
const m = (2 * Math.PI) / colors.length
</script>
{#each colors as color, i}
  {@const a = m * i}
  <CursorLine
    {color}
    cursorPosition={cursorPosition.current}
    position.x={0.3 * Math.cos(a)}
    position.y={0.3 * Math.sin(a)}
  >
    {#snippet children({ getPoints })}
      <MeshLineGeometry
        points={getPoints()}
        shape="taper"
      />
      <MeshLineMaterial
        width={10}
        {color}
        attenuate={false}
      />
    {/snippet}
  </CursorLine>
{/each}
<T.OrthographicCamera
  zoom={50}
  makeDefault
/>
<T.Mesh
  visible={false}
  onpointermove={(event) => {
    cursorPosition.set(event.point.toArray())
  }}
  position.z={-10}
  scale={100}
>
  <T.PlaneGeometry />
</T.Mesh>