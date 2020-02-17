"use strict";
{
    C3.Behaviors.Straskal_Stateful.Instance = class StatefulInstance extends C3.SDKBehaviorInstanceBase
    {
        constructor(behInst, properties)
        {
            super(behInst);
            
            this._conditions = C3.Behaviors.Straskal_Stateful.Cnds;
            this._actions = C3.Behaviors.Straskal_Stateful.Acts;

            /**
             * The current state and previous state of this stateful behavior.
             */
            this._currentState = null;
            this._previousState = null;

            /**
             * next state is only populated if the state is changed and needs to transition.
             */
            this._nextState = properties[0];

            /**
             * Opt in to Tick().
             */
            this._StartTicking();
        }

        Release()
        {
            super.Release();
        }

        Tick()
        {
            if (this._nextState != null) 
            {
                this._StateTransition();
            }            
        }

        GetDebuggerProperties()
        {
            return [
            {
                title: "Stateful",
                properties: [
                {
                    name: "CurrentState",
                    value: this._currentState,
                    onedit: v => this.CallAction(this._actions.SetState, v)},
                {
                    name: "PreviousState",
                    value: this._previousState}
                ]
            }];
        }

        /**
         * Set the next state and switch action to transition.
         * @param {string} state 
         */
        _SetState(state)
        {
            this._nextState = state;
        }

        /**
         * Transition to the next state, invoking OnStateExit and OnStateEnter.
         */
        _StateTransition()
        {
            if (this._currentState)
            {
                this.Trigger(this._conditions.OnStateExit);
            }

            this._previousState = this._currentState;
            this._currentState = this._nextState;
            this._nextState = null;

            this.Trigger(this._conditions.OnStateEnter);
        }
    };
}