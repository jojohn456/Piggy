<template>
  <q-page>
    <div class="row p-2">
      <div class="col-12 navbar rounded-lg shadow-xl p-4 bg-white">
        <div class="navbar-start">
          <button
            class="btn bg-[#FF9DB0] border-2 rounded-xl border-[#000] border-solid hover:bg-[#FF9DB0] hover:border-[#000]"
            v-on:click="$router.push('/')"
          >
            Home
          </button>
        </div>
        <div class="navbar-end">
          <button
            class="btn btn-circle bg-[#FF9DB0] hover:bg-[#FF9DB0]"
            v-on:click="$router.push('/addmompig')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ul>
      <li v-for="mompig in mompigs" :key="mompig.id">
        <div class="row p-2">
          <div class="col-12">
            <div class="card bg-white w-full shadow-xl">
              <div class="card-body">
                <h3 class="font-bold">{{ mompig.Name }}</h3>
                <p>Date: {{ mompig.TheDate }}</p>
                <p>
                  First Heat:
                  {{ date.formatDate(mompig.FirstHeat, 'YYYY/MM/DD') }}
                </p>
                <p>
                  Second Heat:
                  {{ date.formatDate(mompig.SecondHeat, 'YYYY/MM/DD') }}
                </p>
                <p>
                  Vitamins: {{ date.formatDate(mompig.Vitamins, 'YYYY/MM/DD') }}
                </p>
                <p>
                  Farrowing:
                  {{ date.formatDate(mompig.Farrowing, 'YYYY/MM/DD') }}
                </p>
                <p>Notes: {{ mompig.Note }}</p>
                <button
                  class="btn btn-warning w-full mt-1 bg-[#ffff99] hover:bg-[#ffff99] border-2 rounded-xl border-[#000] hover:border-[#000]"
                  variant="filled-warning"
                  v-on:click="$router.push('/editmompig/' + mompig.id)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-error w-full mt-1 hover:bg-[#ff5861] border-2 rounded-xl border-[#000] hover:border-[#000]"
                  size="xl"
                  variant="filled-error"
                  v-on:click="RemoveItem(mompig.id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar, date } from 'quasar';
import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { db } from '../db';

defineOptions({
  name: 'PregnancyTrackerPage',
});

const q$ = useQuasar();

const mompigs = useObservable(
  from(
    liveQuery(async () => {
      return await db.table('mompigs').toArray();
    }),
  ),
);

function RemoveItem(id: number) {
  q$.dialog({
    dark: false,
    title: 'Confirm',
    message: 'Would you like to delete this item?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    db.table('mompigs').where('id').equals(id).delete();
  });
}
</script>
