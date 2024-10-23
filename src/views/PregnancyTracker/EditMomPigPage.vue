<template>
  <q-page class="h-fit">
    <div class="row">
      <div class="col-12 p-3">
        <div class="card bg-white w-full shadow-xl">
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <div
                  class="input-errors"
                  v-for="error of v$.name.$errors"
                  :key="error.$uid"
                >
                  <div class="error-message">
                    <small>{{ error.$message }}</small>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  v-model="data.name"
                  class="input input-bordered w-full border-2 rounded-xl border-[#000] hover:border-[#000]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-12 mt-1">
                <div
                  class="input-errors"
                  v-for="error of v$.theDate.$errors"
                  :key="error.$uid"
                >
                  <div class="error-message">
                    <small>{{ error.$message }}</small>
                  </div>
                </div>
                <q-date
                  class="w-full border-2 rounded-xl border-[#000] hover:border-[#000]"
                  v-model="data.theDate"
                  first-day-of-week="1"
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-12">
                <textarea
                  class="textarea w-full textarea-bordered border-2 rounded-xl border-[#000] hover:border-[#000]"
                  placeholder="Notes"
                  v-model="data.note"
                ></textarea>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-12">
                <button
                  class="btn bg-[#87CEEB] hover:bg-[#87CEEB] w-full border-2 rounded-xl border-[#000] hover:border-[#000]"
                  aria-label="menu"
                  v-bind:disabled="addBtn"
                  v-on:click="ComputeDate"
                >
                  Save
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <button
                  class="btn btn-warning w-full mt-1 bg-[#ffff99] hover:bg-[#ffff99] border-2 rounded-xl border-[#000] hover:border-[#000]"
                  variant="filled-warning"
                  v-on:click="$router.push('/pregnancy-tracker')"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { date } from 'quasar';
import { useRouter } from 'vue-router';

import { liveQuery } from 'dexie';
import { useObservable, from } from '@vueuse/rxjs';
import { db } from '../../db';
defineOptions({
  name: 'EditMomPigPage',
});
const router = useRouter();
let props = defineProps({
  id: String,
});

let id = parseInt(props.id as string, 10);
const data = reactive({
  name: '',
  note: '',
  theDate: new Date(),
});

let mompigs: any = useObservable(
  from(
    liveQuery(async () => {
      return await db
        .table('mompigs')
        .where('id')
        .equals(id)
        .toArray()
        .then(function (results) {
          mompigs = results[0];
          data.name = mompigs.Name;
          data.note = mompigs.Note;
          data.theDate = mompigs.TheDate;
        });
    }),
  ),
);

const rules = {
  name: [{ required: helpers.withMessage('firstname is required', required) }],
  theDate: [{ required: helpers.withMessage('date is required', required) }],
};

const v$ = useVuelidate(rules, data);
let addBtn = false;
function ComputeDate(): void {
  v$.value.$validate();
  if (v$.value.$invalid == true) {
    return;
  } else {
    let myDate = new Date(data.theDate);
    let firstHeat = date.addToDate(myDate, { days: 21 });
    let secondHeat = date.addToDate(myDate, { days: 42 });
    let vitamins = date.addToDate(myDate, { days: 100 });
    let farrowing = date.addToDate(myDate, { days: 114 });
    db.mompigs.update(id, {
      Name: data.name,
      TheDate: data.theDate,
      Note: data.note,
      FirstHeat: firstHeat,
      SecondHeat: secondHeat,
      Vitamins: vitamins,
      Farrowing: farrowing,
    });
    router.push('/pregnancy-tracker');
    addBtn = true;
  }
}
</script>
